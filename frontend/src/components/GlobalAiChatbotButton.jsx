import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CommonButton from './CommonButton';
import GlobalAiChatbotPanel from './GlobalAiChatbotPanel';
import GlobalMemberMessagePanel from './GlobalMemberMessagePanel';
import {
  createDirectRoom,
  getChatMessages,
  getCurrentMember,
  getCurrentMemberId,
  getCurrentMemberType,
  getMyChatRooms,
  isMemberLoggedIn,
} from '../services/chatApi';
import { createChatClient, publishChat, subscribeRoom } from '../services/chatSocket';

export default function GlobalAiChatbotButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activePanel, setActivePanel] = useState(null);

  const [aiInputValue, setAiInputValue] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: '안녕하세요! 대타 AI 챗봇입니다. 조건에 맞는 공고를 빠르게 찾아드릴게요.',
    },
  ]);

  const [member, setMember] = useState(() => getCurrentMember());
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursorId, setNextCursorId] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [memberReply, setMemberReply] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const [memberError, setMemberError] = useState('');

  const clientRef = useRef(null);
  const currentSubscriptionRef = useRef(null);

  const isLoggedIn = useMemo(() => isMemberLoggedIn(), [member, location.pathname]);
  const currentMemberId = useMemo(() => getCurrentMemberId(), [member, location.pathname]);
  const currentMemberType = useMemo(() => getCurrentMemberType(), [member, location.pathname]);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.roomId === selectedRoomId) || null,
    [rooms, selectedRoomId],
  );

  const totalUnreadCount = useMemo(
    () => rooms.reduce((sum, room) => sum + Number(room?.unreadCount || 0), 0),
    [rooms],
  );

  const unreadBadgeCount = useMemo(() => Math.min(totalUnreadCount, 100), [totalUnreadCount]);

  const syncMember = useCallback(() => {
    setMember(getCurrentMember());
  }, []);

  useEffect(() => {
    syncMember();
  }, [location.pathname, syncMember]);

  useEffect(() => {
    const handleStorage = () => syncMember();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [syncMember]);

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

  const loadRooms = useCallback(async (preferredRoomId = null) => {
    if (!isLoggedIn || !currentMemberId) {
      setRooms([]);
      setSelectedRoomId(null);
      return [];
    }

    setRoomsLoading(true);
    setMemberError('');

    try {
      const roomRows = await getMyChatRooms(currentMemberId);
      const mappedRooms = (roomRows || []).map((room) => ({
        ...room,
        displayName: room.partnerEmail || (room.partnerUserId ? `member${room.partnerUserId}@example.com` : '알 수 없는 회원'),
      }));

      setRooms(mappedRooms);

      const targetRoomId =
        preferredRoomId ||
        (mappedRooms.some((room) => room.roomId === selectedRoomId) ? selectedRoomId : mappedRooms[0]?.roomId ?? null);

      setSelectedRoomId(targetRoomId);
      return mappedRooms;
    } catch (error) {
      setMemberError(error.message || '메시지 목록을 불러오지 못했습니다.');
      return [];
    } finally {
      setRoomsLoading(false);
    }
  }, [currentMemberId, isLoggedIn, selectedRoomId]);

  const ensureSocketClient = useCallback(() => {
    if (clientRef.current) {
      if (!clientRef.current.active) {
        clientRef.current.activate();
      }
      return;
    }

    const client = createChatClient({
      email: member?.email || '',
      onError: (error) => {
        setMemberError(error.message || '채팅 서버 연결에 실패했습니다.');
      },
    });

    client.onConnect = async () => {
      setMemberError('');
      if (selectedRoomId) {
        currentSubscriptionRef.current?.unsubscribe?.();
        currentSubscriptionRef.current = subscribeRoom(client, selectedRoomId, (payload) => {
          setMessages((prev) => {
            const key = payload.id ?? `${payload.type}-${payload.sentAt}-${payload.content}`;
            const exists = prev.some(
              (message) =>
                (message.id && payload.id && message.id === payload.id) ||
                (!message.id && !payload.id && `${message.type}-${message.sentAt}-${message.content}` === key),
            );

            if (exists) {
              return prev;
            }
            return [...prev, payload];
          });
          loadRooms(selectedRoomId);
        });

        try {
          publishChat(client, {
            senderId: currentMemberId,
            receiverId: selectedRoom?.partnerUserId ?? null,
            roomId: selectedRoomId,
            email: member?.email || '',
            type: 'ENTER',
          });
          loadRooms(selectedRoomId);
        } catch (error) {
          console.error(error);
        }
      }
    };

    client.activate();
    clientRef.current = client;
  }, [currentMemberId, loadRooms, member?.email, selectedRoom?.partnerUserId, selectedRoomId]);

  useEffect(() => {
    if (activePanel === 'member' && isLoggedIn) {
      ensureSocketClient();
      loadRooms();
    }
  }, [activePanel, ensureSocketClient, isLoggedIn, loadRooms]);

  useEffect(() => {
    if (!isLoggedIn || !currentMemberId) {
      setRooms([]);
      return undefined;
    }

    loadRooms();
    const intervalId = window.setInterval(() => {
      loadRooms();
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [currentMemberId, isLoggedIn, loadRooms]);

  useEffect(() => {
    return () => {
      currentSubscriptionRef.current?.unsubscribe?.();
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !selectedRoomId) {
      setMessages([]);
      setHasMore(false);
      setNextCursorId(null);
      currentSubscriptionRef.current?.unsubscribe?.();
      currentSubscriptionRef.current = null;
      return;
    }

    let mounted = true;

    const loadInitialMessages = async () => {
      setMessagesLoading(true);
      setMemberError('');

      try {
        const response = await getChatMessages(selectedRoomId, null, 50);
        if (!mounted) {
          return;
        }

        setMessages(response?.messages || []);
        setHasMore(Boolean(response?.hasNext));
        setNextCursorId(response?.nextCursorId ?? null);
      } catch (error) {
        if (!mounted) {
          return;
        }
        setMemberError(error.message || '메시지를 불러오지 못했습니다.');
      } finally {
        if (mounted) {
          setMessagesLoading(false);
        }
      }
    };

    loadInitialMessages();

    const client = clientRef.current;
    if (client?.connected) {
      currentSubscriptionRef.current?.unsubscribe?.();
      currentSubscriptionRef.current = subscribeRoom(client, selectedRoomId, (payload) => {
        setMessages((prev) => {
          const key = payload.id ?? `${payload.type}-${payload.sentAt}-${payload.content}`;
          const exists = prev.some(
            (message) =>
              (message.id && payload.id && message.id === payload.id) ||
              (!message.id && !payload.id && `${message.type}-${message.sentAt}-${message.content}` === key),
          );

          if (exists) {
            return prev;
          }
          return [...prev, payload];
        });
        loadRooms(selectedRoomId);
      });

      try {
        publishChat(client, {
          senderId: currentMemberId,
          receiverId: selectedRoom?.partnerUserId ?? null,
          roomId: selectedRoomId,
          email: member?.email || '',
          type: 'ENTER',
        });
      } catch (error) {
        console.error(error);
      }
    }

    return () => {
      mounted = false;
    };
  }, [currentMemberId, isLoggedIn, loadRooms, member?.email, selectedRoom?.partnerUserId, selectedRoomId]);

  const loadOlderMessages = useCallback(async () => {
    if (!selectedRoomId || !nextCursorId || loadingMore) {
      return;
    }

    setLoadingMore(true);
    setMemberError('');

    try {
      const response = await getChatMessages(selectedRoomId, nextCursorId, 50);
      const olderMessages = response?.messages || [];
      setMessages((prev) => [...olderMessages, ...prev]);
      setHasMore(Boolean(response?.hasNext));
      setNextCursorId(response?.nextCursorId ?? null);
    } catch (error) {
      setMemberError(error.message || '이전 메시지를 불러오지 못했습니다.');
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, nextCursorId, selectedRoomId]);

  const submitMemberReply = useCallback(async () => {
    const nextText = memberReply.trim();
    if (!nextText || !selectedRoom || !currentMemberId) {
      return;
    }

    const client = clientRef.current;
    if (!client?.connected) {
      setMemberError('채팅 서버 연결이 아직 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    try {
      setSendLoading(true);
      setMemberError('');

      publishChat(client, {
        senderId: currentMemberId,
        receiverId: selectedRoom.partnerUserId,
        roomId: selectedRoom.roomId,
        email: member?.email || '',
        content: nextText,
        type: 'TALK',
      });

      setMemberReply('');
      loadRooms(selectedRoom.roomId);
    } catch (error) {
      setMemberError(error.message || '메시지 전송에 실패했습니다.');
    } finally {
      setSendLoading(false);
    }
  }, [currentMemberId, loadRooms, member?.email, memberReply, selectedRoom]);

  useEffect(() => {
    const handleOpenDirectChat = async (event) => {
      const partnerUserId = event?.detail?.partnerUserId;
      if (!partnerUserId) {
        return;
      }

      if (!isLoggedIn || !currentMemberId) {
        navigate('/login');
        return;
      }

      if (partnerUserId === currentMemberId) {
        setMemberError('본인과의 채팅은 시작할 수 없습니다.');
        return;
      }

      try {
        setActivePanel('member');
        ensureSocketClient();
        const response = await createDirectRoom(currentMemberId, partnerUserId);
        const roomId = response?.roomId;
        await loadRooms(roomId);
        setSelectedRoomId(roomId);
      } catch (error) {
        setMemberError(error.message || '채팅방을 여는 데 실패했습니다.');
        setActivePanel('member');
      }
    };

    window.addEventListener('open-direct-chat', handleOpenDirectChat);
    return () => window.removeEventListener('open-direct-chat', handleOpenDirectChat);
  }, [currentMemberId, ensureSocketClient, isLoggedIn, loadRooms, navigate]);

  const toggleLauncher = () => {
    setActivePanel((prev) => (prev ? null : 'menu'));
  };

  return (
    <div className="fixed right-6 bottom-24 md:right-10 md:bottom-10 z-[60]">
      <div
        className={[
          'absolute right-0 bottom-20 md:bottom-24 w-44 bg-white border border-outline rounded-xl shadow-xl p-2',
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
        <div className="relative mt-1">
          <CommonButton
            type="button"
            variant="toggle"
            size="sm"
            fullWidth
            className="justify-start px-3"
            inactiveClassName="text-on-surface hover:bg-primary-soft"
            icon={<span className="material-symbols-outlined text-[18px]">forum</span>}
            iconPosition="left"
            disabled={!isLoggedIn}
            onClick={() => {
              if (!isLoggedIn) {
                return;
              }
              setActivePanel('member');
            }}
          >
            회원 메시지함
          </CommonButton>
          {isLoggedIn && unreadBadgeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[12px] font-bold flex items-center justify-center shadow border-2 border-white pointer-events-none">
              {unreadBadgeCount}
            </span>
          )}
        </div>
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
        roomsLoading={roomsLoading}
        selectedRoomId={selectedRoomId}
        messages={messages}
        messagesLoading={messagesLoading}
        hasMore={hasMore}
        loadingMore={loadingMore}
        replyValue={memberReply}
        sendLoading={sendLoading}
        memberError={memberError}
        onSelectConversation={setSelectedRoomId}
        onReplyChange={setMemberReply}
        onSendReply={submitMemberReply}
        onLoadMore={loadOlderMessages}
        onClose={() => setActivePanel(null)}
        onGoLogin={() => navigate('/login')}
        currentMemberId={currentMemberId}
        currentMemberType={currentMemberType}
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
        {isLoggedIn && unreadBadgeCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-6 h-6 px-1 rounded-full bg-red-500 text-white text-[13px] font-bold flex items-center justify-center shadow-lg border-2 border-white">
            {unreadBadgeCount}
          </span>
        )}
      </div>
    </div>
  );
}
