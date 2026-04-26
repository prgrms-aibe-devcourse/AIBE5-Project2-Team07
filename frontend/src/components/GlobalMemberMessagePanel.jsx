import React from "react";
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

                <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2 bg-white">
                  {hasMore && (
                    <div className="flex justify-center mb-2">
                      <button
                        type="button"
                        onClick={onLoadMore}
                        disabled={loadingMore}
                        className="text-xs font-bold text-primary hover:underline disabled:opacity-50"
                      >
                        {loadingMore
                          ? "이전 메시지 불러오는 중..."
                          : "이전 메시지 더보기"}
                      </button>
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
                        message.senderId === currentMemberId &&
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
                            mine ? "flex justify-end" : "flex justify-start"
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
                            {message.content}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form
                  className="px-3 py-2 border-t border-outline flex items-center gap-2 bg-white"
                  onSubmit={(event) => {
                    event.preventDefault();
                    onSendReply();
                  }}
                >
                  <input
                    type="text"
                    value={replyValue}
                    onChange={(event) => onReplyChange(event.target.value)}
                    placeholder="메시지를 입력하세요"
                    className="flex-1 border border-outline rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <CommonButton type="submit" size="sm" disabled={!canSend}>
                    {sendLoading ? "전송 중..." : "보내기"}
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
