import React, { useRef, useEffect } from "react";
import CommonButton from "./CommonButton";

function formatRoomTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
}

function messageKey(message, index) {
  return (
    message.id ??
    `${message.type || "message"}-${message.sentAt || ""}-${index}`
  );
}

function renderMessageContent(content) {
  if (!content) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 break-all font-bold hover:opacity-80"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function formatMessageTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export default function GlobalMemberMessagePanel({
  isOpen,
  isLoggedIn,
  rooms,
  roomsLoading,
  selectedRoomId,
  messages,
  messagesLoading,
  hasMore,
  loadingMore,
  replyValue,
  sendLoading,
  memberError,
  onSelectConversation,
  onReplyChange,
  onSendReply,
  onLoadMore,
  onClose,
  onGoLogin,
  currentMemberId,
  currentMemberType,
}) {
  const selectedRoom =
    rooms.find((room) => room.roomId === selectedRoomId) || null;
  const canSend =
    replyValue.trim().length > 0 && !sendLoading && Boolean(selectedRoomId);

  const partnerRoleLabel =
    currentMemberType === "BUSINESS"
      ? "개인회원"
      : currentMemberType === "INDIVIDUAL"
        ? "사업자회원"
        : "회원";

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const isInitialLoad = useRef(true);

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
    }
  };

  const lastMessage =
    messages && messages.length > 0 ? messages[messages.length - 1] : null;
  const lastMessageId = lastMessage
    ? lastMessage.id ?? lastMessage.sentAt
    : null;

  const messagesContainerRef = useRef(null);
  const previousScrollHeight = useRef(0);
  const isFetchingMore = useRef(false);

  useEffect(() => {
    isFetchingMore.current = loadingMore;
  }, [loadingMore]);

  useEffect(() => {
    isInitialLoad.current = true;
    previousScrollHeight.current = 0;
  }, [selectedRoomId]);

  useEffect(() => {
    if (
      messagesContainerRef.current &&
      previousScrollHeight.current > 0 &&
      !isInitialLoad.current
    ) {
      const newScrollHeight = messagesContainerRef.current.scrollHeight;
      if (newScrollHeight > previousScrollHeight.current) {
        messagesContainerRef.current.scrollTop +=
          newScrollHeight - previousScrollHeight.current;
        previousScrollHeight.current = 0;
      }
    }
  }, [messages]);

  const handleScroll = (e) => {
    if (
      e.target.scrollTop <= 10 &&
      hasMore &&
      !loadingMore &&
      !isFetchingMore.current
    ) {
      isFetchingMore.current = true;
      previousScrollHeight.current = e.target.scrollHeight;
      onLoadMore();
    }
  };

  useEffect(() => {
    if (lastMessageId) {
      setTimeout(() => {
        if (isInitialLoad.current) {
          scrollToBottom("auto");
          isInitialLoad.current = false;
        } else {
          scrollToBottom("smooth");
        }
      }, 50);
    }
  }, [lastMessageId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      if (replyValue) {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  }, [replyValue]);

  return (
    <div
      className={[
        "absolute right-0 w-[calc(100vw-3rem)] max-w-[360px] md:max-w-[460px]",
        "bg-white border border-outline rounded-2xl shadow-2xl overflow-hidden",
        "transition-all duration-200 origin-bottom-right",
        "bottom-20 md:bottom-24",
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none",
      ].join(" ")}
      role="dialog"
      aria-label="회원 메시지함"
    >
      <div className="px-4 py-3 border-b border-outline bg-primary-soft/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            forum
          </span>
          <div>
            <p className="text-sm font-bold text-on-surface">회원 메시지함</p>
            <p className="text-[11px] text-on-surface-variant">
              개인회원 ↔ 사업자회원 대화
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="메시지함 닫기"
          className="text-on-surface-variant hover:text-primary transition-colors"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {!isLoggedIn ? (
        <div className="px-6 py-10 text-center bg-white">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-soft flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">
              lock
            </span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-2">
            로그인이 필요합니다
          </h3>
          <p className="text-sm text-on-surface-variant mb-6">
            회원 메시지함은 로그인 후 사용할 수 있습니다.
          </p>
          <CommonButton size="full" onClick={onGoLogin}>
            로그인하러 가기
          </CommonButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] h-[460px]">
          <aside className="border-r border-outline bg-[#FAFAFA] overflow-y-auto">
            {roomsLoading ? (
              <div className="px-4 py-6 text-sm text-on-surface-variant">
                메시지 목록을 불러오는 중입니다...
              </div>
            ) : rooms.length === 0 ? (
              <div className="px-4 py-6 text-sm text-on-surface-variant">
                아직 시작한 대화가 없습니다.
              </div>
            ) : (
              rooms.map((room) => {
                const isActive = room.roomId === selectedRoomId;
                const unread = Number(room.unreadCount || 0);
                const displayName =
                  room.displayName ||
                  room.partnerEmail ||
                  `member${room.partnerUserId ?? ""}@example.com`;

                return (
                  <button
                    key={room.roomId}
                    type="button"
                    onClick={() => onSelectConversation(room.roomId)}
                    className={[
                      "w-full text-left px-3 py-3 border-b border-outline/70 transition-colors",
                      isActive ? "bg-primary-soft/40" : "hover:bg-gray-100",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-on-surface truncate">
                        {displayName}
                      </p>
                      <span className="text-[10px] text-on-surface-variant">
                        {formatRoomTime(room.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-[11px] text-on-surface-variant truncate">
                        {room.lastMessageContent || "대화를 시작해보세요."}
                      </p>
                      {unread > 0 && (
                        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-primary text-white text-[10px] font-bold">
                          {unread > 100 ? 100 : unread}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </aside>

          <section className="flex flex-col min-h-0 bg-white">
            {selectedRoom ? (
              <>
                <div className="px-3 py-2 border-b border-outline bg-white">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-on-surface">
                      {selectedRoom.displayName}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-soft text-primary font-bold">
                      {partnerRoleLabel}
                    </span>
                  </div>
                </div>

                <div
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2 bg-white"
                >
                  {hasMore && (
                    <div className="flex justify-center mb-2 h-6 items-center">
                      {loadingMore && (
                        <span className="text-xs font-bold text-primary opacity-70">
                          이전 메시지 불러오는 중...
                        </span>
                      )}
                    </div>
                  )}

                  {messagesLoading ? (
                    <p className="text-sm text-on-surface-variant text-center py-6">
                      메시지를 불러오는 중입니다...
                    </p>
                  ) : messages.length === 0 ? (
                    <p className="text-sm text-on-surface-variant text-center py-6">
                      첫 메시지를 보내 대화를 시작해보세요.
                    </p>
                  ) : (
                    messages.map((message, index) => {
                      const mine =
                        String(message.senderId) === String(currentMemberId) &&
                        message.type === "TALK";
                      const systemMessage =
                        message.type === "ENTER" || message.type === "LEAVE";

                      if (systemMessage) {
                        return (
                          <div
                            key={messageKey(message, index)}
                            className="flex justify-center"
                          >
                            <div className="px-3 py-1 rounded-full bg-gray-100 text-[11px] text-on-surface-variant">
                              {message.content}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={messageKey(message, index)}
                          className={
                            mine ? "flex flex-col items-end" : "flex flex-col items-start"
                          }
                        >
                          <div
                            className={[
                              "max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap break-words",
                              mine
                                ? "bg-primary text-white rounded-br-md"
                                : "bg-gray-100 text-on-surface rounded-bl-md border border-outline",
                            ].join(" ")}
                          >
                            {renderMessageContent(message.content)}
                          </div>
                          {message.sentAt && (
                            <span className="text-[10px] text-on-surface-variant mt-1 px-1">
                              {formatMessageTime(message.sentAt)}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  className="px-3 py-2 border-t border-outline flex items-end gap-2 bg-white"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (canSend) {
                      onSendReply();
                    }
                  }}
                >
                  <textarea
                    ref={textareaRef}
                    value={replyValue}
                    onChange={(event) => onReplyChange(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        if (canSend) {
                          onSendReply();
                        }
                      }
                    }}
                    placeholder="메시지를 입력하세요 (Shift+Enter로 줄바꿈)"
                    className="flex-1 border border-outline rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none overflow-y-auto leading-relaxed"
                    rows={1}
                    style={{ minHeight: "38px", maxHeight: "120px" }}
                  />
                  <CommonButton type="submit" size="sm" disabled={!canSend} className="mb-0.5 whitespace-nowrap">
                    {sendLoading ? "전송 중" : "보내기"}
                  </CommonButton>
                </form>

                {memberError && (
                  <p className="px-3 pb-3 text-[11px] text-red-600 bg-white">
                    {memberError}
                  </p>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-on-surface-variant px-6 text-center">
                대화할 메시지방을 선택해 주세요.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
