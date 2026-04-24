import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CommonButton from './CommonButton';
import GlobalAiChatbotPanel from './GlobalAiChatbotPanel';
import GlobalMemberMessagePanel from './GlobalMemberMessagePanel';
import { getStoredMember } from '../services/authApi';
import { getChatHistory, getMyChatRooms } from '../services/chatApi';
import { createChatSocketClient } from '../services/chatSocket';

function readCurrentMember() {
  const token = localStorage.getItem('token');
  const member = getStoredMember();
  return token && member ? member : null;
}

function getRoleLabel(memberType) {
  if (memberType === 'BUSINESS') {
    return '개인회원';
  }
  if (memberType === 'INDIVIDUAL') {
    return '사업자회원';
  }
  return '회원';
}

function normalizeRoom(room, currentMember) {
  const partnerUserId = room?.partnerUserId ?? null;
  const roleLabel = getRoleLabel(currentMember?.memberType);

  return {
    roomId: room.roomId,
    partnerUserId,
    displayName: partnerUserId ? `${roleLabel} #${partnerUserId}` : room.roomId,
    roleLabel,
    preview: room.lastMessageContent || '대화를 시작해보세요.',
    lastMessageAt: room.lastMessageAt || null,
    unreadCount: Number(room.unreadCount || 0),
  };
}

function normalizeMessage(message, currentMemberId) {
  return {
    id: message.id,
    mine: message.senderId === currentMemberId,
    text: message.content,
    sentAt: message.sentAt,
    senderId: message.senderId,
    roomId: message.roomId,
    type: message.type,
  };
}

function uniqueMessages(messages) {
  const seen = new Set();
  return messages.filter((message) => {
    const key = message.id ?? `${message.roomId}-${message.sentAt}-${message.text}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function sortRoomsByRecent(rooms) {
  return [...rooms].sort((a, b) => {
    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bTime - aTime;
  });
}

export default function GlobalAiChatbotButton() {
  const location = useLocation();

  const [activePanel, setActivePanel] = useState(null);
  const [currentMember, setCurrentMember] = useState(() => readCurrentMember());

  const [aiInputValue, setAiInputValue] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: '안녕하세요! 대타 AI 챗봇입니다. 조건에 맞는 공고를 빠르게 찾아드릴게요.',
    },
  ]);

  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [messageStateByRoom, setMessageStateByRoom] = useState({});
  const [memberReply, setMemberReply] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingRoomId, setLoadingRoomId] = useState(null);
  const [chatError, setChatError] = useState('');
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const socketRef = useRef(null);
  const selectedRoomIdRef = useRef(null);
  const activePanelRef = useRef(null);
  const roomsRef = useRef([]);
  const memberRef = useRef(currentMember);

  useEffect(() => {
    selectedRoomIdRef.current = selectedRoomId;
  }, [selectedRoomId]);

  useEffect(() => {
    activePanelRef.current = activePanel;
  }, [activePanel]);

  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);

  useEffect(() => {
    memberRef.current = currentMember;
  }, [currentMember]);

  useEffect(() => {
    const syncMember = () => {
      setCurrentMember(readCurrentMember());
    };

    syncMember();
    window.addEventListener('storage', syncMember);

    return () => {
      window.removeEventListener('storage', syncMember);
    };
  }, [location.pathname]);

  const isLoggedIn = Boolean(currentMember?.id);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.roomId === selectedRoomId) || null,
    [rooms, selectedRoomId],
  );

  const selectedRoomState = useMemo(
    () => messageStateByRoom[selectedRoomId] || { messages: [], nextCursorId: null, hasNext: false },
    [messageStateByRoom, selectedRoomId],
  );

  const totalUnreadCount = useMemo(
    () => rooms.reduce((sum, room) => sum + Number(room.unreadCount || 0), 0),
    [rooms],
  );

  const syncRoomSubscriptions = useCallback((nextRooms) => {
    if (!socketRef.current?.isConnected()) {
      return;
    }

    const destinations = nextRooms.map((room) => `/sub/room/${room.roomId}`);
    socketRef.current.syncSubscriptions(destinations);
  }, []);

  const refreshRooms = useCallback(async ({ preserveSelection = true, selectFirstRoom = false } = {}) => {
    if (!memberRef.current?.id) {
      return [];
    }

    setLoadingRooms(true);
    setChatError('');

    try {
      const result = await getMyChatRooms(memberRef.current.id);
      const normalizedRooms = sortRoomsByRecent((result || []).map((room) => normalizeRoom(room, memberRef.current)));

      setRooms(normalizedRooms);
      syncRoomSubscriptions(normalizedRooms);

      const previousSelected = preserveSelection ? selectedRoomIdRef.current : null;
      const nextSelectedRoomId =
        previousSelected && normalizedRooms.some((room) => room.roomId === previousSelected)
          ? previousSelected
          : normalizedRooms[0]?.roomId || null;

      setSelectedRoomId(nextSelectedRoomId);

      if (selectFirstRoom && nextSelectedRoomId) {
        return normalizedRooms;
      }

      return normalizedRooms;
    } catch (error) {
      setChatError(error.message || '채팅 목록을 불러오지 못했습니다.');
      return [];
    } finally {
      setLoadingRooms(false);
    }
  }, [syncRoomSubscriptions]);

  const markRoomAsRead = useCallback((room) => {
    if (!room || !memberRef.current || !socketRef.current?.isConnected()) {
      return;
    }

    try {
      socketRef.current.publish('/pub/chat/message', {
        senderId: memberRef.current.id,
        receiverId: room.partnerUserId,
        email: memberRef.current.email,
        roomId: room.roomId,
        type: 'ENTER',
      });
    } catch (error) {
      setChatError(error.message || '읽음 상태를 갱신하지 못했습니다.');
    }

    setRooms((prev) =>
      prev.map((item) => (item.roomId === room.roomId ? { ...item, unreadCount: 0 } : item)),
    );
  }, []);

  const loadRoomMessages = useCallback(async (roomId, { cursorId = null, appendOlder = false } = {}) => {
    if (!memberRef.current?.id || !roomId) {
      return;
    }

    setLoadingRoomId(roomId);
    setChatError('');

    try {
      const history = await getChatHistory(roomId, cursorId, 30);
      const normalizedMessages = (history?.messages || []).map((message) => normalizeMessage(message, memberRef.current.id));

      setMessageStateByRoom((prev) => {
        const current = prev[roomId] || { messages: [], nextCursorId: null, hasNext: false };
        const mergedMessages = appendOlder
          ? uniqueMessages([...normalizedMessages, ...current.messages])
          : uniqueMessages(normalizedMessages);

        return {
          ...prev,
          [roomId]: {
            messages: mergedMessages,
            nextCursorId: history?.nextCursorId ?? null,
            hasNext: Boolean(history?.hasNext),
          },
        };
      });
    } catch (error) {
      setChatError(error.message || '채팅 내역을 불러오지 못했습니다.');
    } finally {
      setLoadingRoomId((prev) => (prev === roomId ? null : prev));
    }
  }, []);

  const handleIncomingChatMessage = useCallback(
    (payload) => {
      if (!payload?.roomId || payload.type === 'ENTER' || payload.type === 'LEAVE') {
        return;
      }

      const me = memberRef.current;
      if (!me?.id) {
        return;
      }

      const incomingMessage = normalizeMessage(payload, me.id);
      const isCurrentRoomOpen = activePanelRef.current === 'member' && selectedRoomIdRef.current === payload.roomId;

      setMessageStateByRoom((prev) => {
        const current = prev[payload.roomId] || { messages: [], nextCursorId: null, hasNext: false };
        return {
          ...prev,
          [payload.roomId]: {
            ...current,
            messages: uniqueMessages([...current.messages, incomingMessage]),
          },
        };
      });

      setRooms((prev) => {
        const existingRoom = prev.find((room) => room.roomId === payload.roomId);
        const fallbackRoleLabel = getRoleLabel(me.memberType);
        const nextUnreadCount = incomingMessage.mine || isCurrentRoomOpen
          ? 0
          : Number(existingRoom?.unreadCount || 0) + 1;

        const updatedRoom = {
          roomId: payload.roomId,
          partnerUserId:
            existingRoom?.partnerUserId ||
            (incomingMessage.mine ? null : incomingMessage.senderId),
          displayName:
            existingRoom?.displayName ||
            (incomingMessage.mine ? payload.roomId : `${fallbackRoleLabel} #${incomingMessage.senderId}`),
          roleLabel: existingRoom?.roleLabel || fallbackRoleLabel,
          preview: incomingMessage.text,
          lastMessageAt: incomingMessage.sentAt,
          unreadCount: nextUnreadCount,
        };

        const filteredRooms = prev.filter((room) => room.roomId !== payload.roomId);
        return sortRoomsByRecent([updatedRoom, ...filteredRooms]);
      });

      if (!incomingMessage.mine && isCurrentRoomOpen) {
        const room = roomsRef.current.find((item) => item.roomId === payload.roomId);
        markRoomAsRead(room || { roomId: payload.roomId, partnerUserId: incomingMessage.senderId });
      }
    },
    [markRoomAsRead],
  );

  useEffect(() => {
    if (!isLoggedIn) {
      setRooms([]);
      setSelectedRoomId(null);
      setMessageStateByRoom({});
      setMemberReply('');
      setChatError('');
      setIsSocketConnected(false);
      setActivePanel((prev) => (prev === 'member' ? null : prev));

      if (socketRef.current) {
        socketRef.current.deactivate();
        socketRef.current = null;
      }
      return undefined;
    }

    let isMounted = true;

    try {
      const socketClient = createChatSocketClient({
        email: currentMember.email,
        onConnect: async () => {
          if (!isMounted) {
            return;
          }
          setIsSocketConnected(true);
          await refreshRooms({ preserveSelection: true, selectFirstRoom: activePanelRef.current === 'member' });
        },
        onDisconnect: () => {
          if (isMounted) {
            setIsSocketConnected(false);
          }
        },
        onMessage: handleIncomingChatMessage,
        onError: (message) => {
          if (isMounted) {
            setChatError(message);
          }
        },
      });

      socketRef.current = socketClient;
      socketClient.activate();
    } catch (error) {
      setChatError(error.message || '채팅 연결을 시작하지 못했습니다.');
    }

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.deactivate();
        socketRef.current = null;
      }
      setIsSocketConnected(false);
    };
  }, [currentMember?.email, handleIncomingChatMessage, isLoggedIn, refreshRooms]);

  useEffect(() => {
    if (activePanel !== 'member' || !isLoggedIn) {
      return;
    }

    refreshRooms({ preserveSelection: true });
  }, [activePanel, isLoggedIn, refreshRooms]);

  useEffect(() => {
    if (activePanel !== 'member' || !selectedRoomId || !isLoggedIn) {
      return;
    }

    const currentRoomState = messageStateByRoom[selectedRoomId];
    const room = rooms.find((item) => item.roomId === selectedRoomId);

    if (!currentRoomState) {
      loadRoomMessages(selectedRoomId);
    }

    if (room) {
      markRoomAsRead(room);
    }
  }, [activePanel, isLoggedIn, loadRoomMessages, markRoomAsRead, messageStateByRoom, rooms, selectedRoomId]);

  const submitAiMessage = (text) => {
    const nextText = text.trim();
    if (!nextText) {
      return;
    }

    setAiMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', text: nextText },
      {
        id: Date.now() + 1,
        role: 'bot',
        text: `"${nextText}" 조건으로 대타 공고를 찾는 중입니다. 원하는 지역/시간대를 추가로 알려주시면 더 정확히 추천할게요.`,
      },
    ]);
    setAiInputValue('');
  };

  const handleSelectRoom = async (roomId) => {
    setSelectedRoomId(roomId);
    setMemberReply('');
    const room = rooms.find((item) => item.roomId === roomId);

    await loadRoomMessages(roomId);

    if (room) {
      markRoomAsRead(room);
    }
  };

  const handleLoadOlderMessages = async () => {
    if (!selectedRoomId || !selectedRoomState.nextCursorId) {
      return;
    }

    await loadRoomMessages(selectedRoomId, {
      cursorId: selectedRoomState.nextCursorId,
      appendOlder: true,
    });
  };

  const submitMemberReply = () => {
    const nextText = memberReply.trim();
    if (!nextText || !selectedRoom || !currentMember || !socketRef.current?.isConnected()) {
      return;
    }

    try {
      socketRef.current.publish('/pub/chat/message', {
        senderId: currentMember.id,
        receiverId: selectedRoom.partnerUserId,
        email: currentMember.email,
        roomId: selectedRoom.roomId,
        content: nextText,
        type: 'TALK',
      });
      setMemberReply('');
      setChatError('');
    } catch (error) {
      setChatError(error.message || '메시지 전송에 실패했습니다.');
    }
  };

  const toggleLauncher = () => {
    setActivePanel((prev) => (prev ? null : 'menu'));
  };

  return (
    <div className="fixed right-6 bottom-24 md:right-10 md:bottom-10 z-[60]">
      <div
        className={[
          'absolute right-0 bottom-20 md:bottom-24 w-52 bg-white border border-outline rounded-xl shadow-xl p-2',
          'transition-all duration-200 origin-bottom-right',
          activePanel === 'menu' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none',
        ].join(' ')}
      >
        <CommonButton
          type="button"
          variant="toggle"
          size="sm"
          fullWidth
          className="justify-start px-3"
          inactiveClassName="text-on-surface hover:bg-primary-soft"
          icon={<span className="material-symbols-outlined text-[18px]">smart_toy</span>}
          iconPosition="left"
          onClick={() => setActivePanel('ai')}
        >
          AI 챗봇
        </CommonButton>
        <CommonButton
          type="button"
          variant="toggle"
          size="sm"
          fullWidth
          className="justify-start px-3 mt-1"
          inactiveClassName="text-on-surface hover:bg-primary-soft"
          icon={<span className="material-symbols-outlined text-[18px]">forum</span>}
          iconPosition="left"
          onClick={() => {
            if (!isLoggedIn) {
              return;
            }
            setActivePanel('member');
          }}
          disabled={!isLoggedIn}
        >
          회원 메시지함
        </CommonButton>
        {!isLoggedIn ? (
          <p className="mt-2 px-3 text-[11px] leading-4 text-on-surface-variant">회원 메시지함은 로그인 후 사용할 수 있습니다.</p>
        ) : null}
      </div>

      <GlobalAiChatbotPanel
        isOpen={activePanel === 'ai'}
        messages={aiMessages}
        inputValue={aiInputValue}
        onInputChange={setAiInputValue}
        onSend={() => submitAiMessage(aiInputValue)}
        onClose={() => setActivePanel(null)}
        onQuickAction={submitAiMessage}
      />

      <GlobalMemberMessagePanel
        isOpen={activePanel === 'member'}
        isLoggedIn={isLoggedIn}
        rooms={rooms}
        selectedRoomId={selectedRoomId}
        onSelectRoom={handleSelectRoom}
        messages={selectedRoomState.messages}
        loadingRooms={loadingRooms}
        loadingMessages={loadingRoomId === selectedRoomId}
        connected={isSocketConnected}
        historyHasNext={selectedRoomState.hasNext}
        onLoadOlder={handleLoadOlderMessages}
        replyValue={memberReply}
        onReplyChange={setMemberReply}
        onSendReply={submitMemberReply}
        onRefreshRooms={() => refreshRooms({ preserveSelection: true })}
        onClose={() => setActivePanel(null)}
        errorMessage={chatError}
      />

      <div className="relative">
        <CommonButton
          variant="fab"
          size="fab"
          className="shadow-2xl"
          aria-label="대타 메시지 도구 열기"
          onClick={toggleLauncher}
        >
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            {activePanel ? 'close' : 'chat_bubble'}
          </span>
        </CommonButton>

        {isLoggedIn && totalUnreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 min-w-6 h-6 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-md">
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </span>
        ) : null}
      </div>
    </div>
  );
}
