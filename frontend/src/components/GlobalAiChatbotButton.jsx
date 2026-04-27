import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CommonButton from './CommonButton';
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
  const activePanelRef = useRef(activePanel);

  useEffect(() => {
    activePanelRef.current = activePanel;
  }, [activePanel]);

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
  const loginHintTimerRef = useRef(null);
  const [showLoginHint, setShowLoginHint] = useState(false);

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

  const markAsReadIfViewing = useCallback((roomId, partnerUserId) => {
    if (!roomId) return;
    const client = clientRef.current;
    if (activePanelRef.current === 'member' && client?.connected) {
      try {
        publishChat(client, {
          senderId: currentMemberId,
          receiverId: partnerUserId ?? null,
          roomId: roomId,
          email: member?.email || '',
          type: 'ENTER',
        });
        setRooms((prev) => prev.map((r) => r.roomId === roomId ? { ...r, unreadCount: 0 } : r));
        setTimeout(() => loadRooms(roomId), 300);
      } catch (error) {
        console.error(error);
      }
    }
  }, [currentMemberId, member?.email, loadRooms]);

  const ensureSocketClient = useCallback(() => {
    if (clientRef.current) {
      if (!clientRef.current.active) {
        clientRef.current.activate();
      }
      return;
    }

    const client = createChatClient({
      email: member?.email || '',
      memberId: currentMemberId,
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

          if (activePanelRef.current === 'member') {
            markAsReadIfViewing(selectedRoomId, selectedRoom?.partnerUserId);
          } else {
            loadRooms(selectedRoomId);
          }
        });

        if (activePanelRef.current === 'member') {
          markAsReadIfViewing(selectedRoomId, selectedRoom?.partnerUserId);
        }
        loadRooms(selectedRoomId);
      }
    };

    client.activate();
    clientRef.current = client;
  }, [currentMemberId, loadRooms, markAsReadIfViewing, member?.email, selectedRoom?.partnerUserId, selectedRoomId]);

  useEffect(() => {
    if (activePanel === 'member' && isLoggedIn) {
      ensureSocketClient();
      loadRooms();
      if (selectedRoomId) {
        markAsReadIfViewing(selectedRoomId, selectedRoom?.partnerUserId);
      }
    }
  }, [activePanel, ensureSocketClient, isLoggedIn, loadRooms, selectedRoomId, selectedRoom?.partnerUserId, markAsReadIfViewing]);

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
      if (loginHintTimerRef.current) {
        window.clearTimeout(loginHintTimerRef.current);
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

        const initialMsgs = response?.messages || [];
        setMessages(initialMsgs);
        setHasMore(initialMsgs.length > 0 ? Boolean(response?.hasNext) : false);
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

        if (activePanelRef.current === 'member') {
          markAsReadIfViewing(selectedRoomId, selectedRoom?.partnerUserId);
        } else {
          loadRooms(selectedRoomId);
        }
      });

      if (activePanelRef.current === 'member') {
        markAsReadIfViewing(selectedRoomId, selectedRoom?.partnerUserId);
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

      if (olderMessages.length === 0) {
        setHasMore(false);
        setNextCursorId(null);
      } else {
        setMessages((prev) => [...olderMessages, ...prev]);
        setHasMore(Boolean(response?.hasNext));
        setNextCursorId(response?.nextCursorId ?? null);
      }
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

  useEffect(() => {
    const handleSendDirectMessages = async (event) => {
      const partnerUserId = event?.detail?.partnerUserId;
      const messagesToSend = event?.detail?.messages;
      if (!partnerUserId || !messagesToSend || messagesToSend.length === 0) {
        return;
      }

      if (!isLoggedIn || !currentMemberId) {
        navigate('/login');
        return;
      }

      if (String(partnerUserId) === String(currentMemberId)) {
        setMemberError('본인에게 메시지를 보낼 수 없습니다.');
        return;
      }

      try {
        setActivePanel('member');
        ensureSocketClient();
        const response = await createDirectRoom(currentMemberId, partnerUserId);
        const roomId = response?.roomId;
        await loadRooms(roomId);
        setSelectedRoomId(roomId);

        const sendMessagesWhenConnected = () => {
          const client = clientRef.current;
          if (!client) return;

          if (client.connected) {
            let delay = 0;
            messagesToSend.forEach((content) => {
              setTimeout(() => {
                publishChat(client, {
                  senderId: currentMemberId,
                  receiverId: partnerUserId,
                  roomId: roomId,
                  email: member?.email || '',
                  content: content,
                  type: 'TALK',
                });
              }, delay);
              delay += 300; // 300ms delay to ensure order
            });
            setTimeout(() => loadRooms(roomId), delay + 200);
          } else {
            setTimeout(sendMessagesWhenConnected, 200);
          }
        };

        sendMessagesWhenConnected();
      } catch (error) {
        setMemberError(error.message || '메시지 전송에 실패했습니다.');
        setActivePanel('member');
      }
    };

    window.addEventListener('send-direct-messages', handleSendDirectMessages);
    return () => window.removeEventListener('send-direct-messages', handleSendDirectMessages);
  }, [currentMemberId, ensureSocketClient, isLoggedIn, loadRooms, member?.email, navigate]);

  const toggleMessagePanel = () => {
    if (!isLoggedIn) {
      setShowLoginHint(true);
      if (loginHintTimerRef.current) {
        window.clearTimeout(loginHintTimerRef.current);
      }
      loginHintTimerRef.current = window.setTimeout(() => {
        setShowLoginHint(false);
      }, 3000);
      return;
    }
    setShowLoginHint(false);
    setActivePanel((prev) => (prev === 'member' ? null : 'member'));
  };

  return (
    <div className="fixed right-6 bottom-24 md:right-10 md:bottom-10 z-[60]">
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
        {showLoginHint && (
          <p className="absolute -top-12 right-0 whitespace-nowrap rounded-lg border border-outline bg-white px-3 py-1.5 text-xs font-semibold text-on-surface-variant shadow-md">
            채팅 기능은 로그인 하면 이용할 수 있어요!
          </p>
        )}
        <CommonButton
          variant="fab"
          size="fab"
          className="shadow-2xl"
          aria-label="회원 메시지함 열기"
          onClick={toggleMessagePanel}
        >
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            {activePanel === 'member' ? 'close' : 'forum'}
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
