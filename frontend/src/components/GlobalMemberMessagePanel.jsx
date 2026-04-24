import React, { useMemo } from 'react';
import CommonButton from './CommonButton';

function formatListTime(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  return date.toLocaleDateString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  });
}

function formatMessageTime(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function GlobalMemberMessagePanel({
  isOpen,
  isLoggedIn,
  rooms,
  selectedRoomId,
  onSelectRoom,
  messages,
  loadingRooms,
  loadingMessages,
  connected,
  historyHasNext,
  onLoadOlder,
  replyValue,
  onReplyChange,
  onSendReply,
  onRefreshRooms,
  onClose,
  errorMessage,
}) {
  const selectedRoom = useMemo(
    () => rooms.find((room) => room.roomId === selectedRoomId) || null,
    [rooms, selectedRoomId],
  );

  const canSend = useMemo(
    () => Boolean(selectedRoom && connected && replyValue.trim().length > 0),
    [selectedRoom, connected, replyValue],
  );

  return (
    <div
      className={[
        'absolute right-0 w-[calc(100vw-2rem)] max-w-[880px]',
        'bg-white border border-outline rounded-3xl shadow-2xl overflow-hidden',
        'transition-all duration-200 origin-bottom-right',
        'bottom-20 md:bottom-24',
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none',
      ].join(' ')}
      role="dialog"
      aria-label="회원 메시지함"
    >
      <div className="px-4 py-3 border-b border-outline bg-primary-soft/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="material-symbols-outlined text-primary shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            forum
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-on-surface">회원 메시지함</p>
            <p className="text-[11px] text-on-surface-variant">
              {isLoggedIn ? '개인회원 ↔ 사업자회원 1:1 대화' : '로그인 후 이용 가능합니다.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn ? (
            <span
              className={[
                'px-2.5 py-1 rounded-full text-[11px] font-bold border',
                connected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200',
              ].join(' ')}
            >
              {connected ? '실시간 연결됨' : '재연결 중'}
            </span>
          ) : null}

          {isLoggedIn ? (
            <CommonButton
              type="button"
              variant="subtle"
              size="sm"
              onClick={onRefreshRooms}
              className="rounded-xl"
            >
              새로고침
            </CommonButton>
          ) : null}

          <button
            type="button"
            aria-label="메시지함 닫기"
            className="text-on-surface-variant hover:text-primary transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {!isLoggedIn ? (
        <div className="h-[420px] flex flex-col items-center justify-center gap-3 bg-white px-6 text-center">
          <span className="material-symbols-outlined text-5xl text-primary/70">lock</span>
          <p className="text-base font-bold text-on-surface">회원 메시지함은 로그인 후 사용할 수 있어요.</p>
          <p className="text-sm text-on-surface-variant">로그인하면 채팅 목록을 확인하고 대화를 이어볼 수 있습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] h-[480px]">
          <aside className="border-r border-outline bg-[#FAFAFA] overflow-y-auto">
            {loadingRooms ? (
              <div className="h-full flex items-center justify-center text-sm text-on-surface-variant">채팅 목록을 불러오는 중...</div>
            ) : rooms.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 px-5 text-center">
                <span className="material-symbols-outlined text-4xl text-primary/60">chat_bubble_outline</span>
                <p className="text-sm font-bold text-on-surface">아직 대화가 없습니다.</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  메시지가 생성되면 이곳에 최신 순으로 표시됩니다.
                </p>
              </div>
            ) : (
              rooms.map((room) => {
                const isActive = room.roomId === selectedRoomId;

                return (
                  <button
                    key={room.roomId}
                    type="button"
                    onClick={() => onSelectRoom(room.roomId)}
                    className={[
                      'w-full text-left px-4 py-3 border-b border-outline/70 transition-colors',
                      isActive ? 'bg-primary-soft/40' : 'hover:bg-gray-100',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">{room.displayName}</p>
                        <p className="text-[11px] text-primary font-semibold mt-1">{room.roleLabel}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] text-on-surface-variant">{formatListTime(room.lastMessageAt)}</span>
                        {room.unreadCount > 0 ? (
                          <span className="min-w-5 h-5 px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                            {room.unreadCount > 99 ? '99+' : room.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2 truncate">{room.preview || '대화를 시작해보세요.'}</p>
                  </button>
                );
              })
            )}
          </aside>

          <section className="flex flex-col min-h-0 bg-white">
            {selectedRoom ? (
              <>
                <div className="px-4 py-3 border-b border-outline bg-white flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">{selectedRoom.displayName}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-soft text-primary font-bold shrink-0">
                        {selectedRoom.roleLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-1 truncate">roomId: {selectedRoom.roomId}</p>
                  </div>
                </div>

                {errorMessage ? (
                  <div className="mx-4 mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 font-medium">
                    {errorMessage}
                  </div>
                ) : null}

                <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 bg-white">
                  {historyHasNext ? (
                    <div className="flex justify-center">
                      <CommonButton type="button" variant="subtle" size="sm" onClick={onLoadOlder} className="rounded-xl">
                        이전 대화 더보기
                      </CommonButton>
                    </div>
                  ) : null}

                  {loadingMessages ? (
                    <div className="h-full flex items-center justify-center text-sm text-on-surface-variant">
                      대화 내용을 불러오는 중...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-center text-on-surface-variant px-6">
                      <span className="material-symbols-outlined text-4xl text-primary/60">forum</span>
                      <p className="text-sm font-bold text-on-surface">아직 메시지가 없습니다.</p>
                      <p className="text-xs">첫 메시지를 보내 대화를 시작해보세요.</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id ?? `${message.sentAt}-${message.text}`} className={message.mine ? 'flex justify-end' : 'flex justify-start'}>
                        <div className="max-w-[85%]">
                          <div
                            className={[
                              'px-3 py-2 rounded-2xl text-xs leading-relaxed break-words',
                              message.mine
                                ? 'bg-primary text-white rounded-br-md'
                                : 'bg-gray-100 text-on-surface rounded-bl-md border border-outline',
                            ].join(' ')}
                          >
                            {message.text}
                          </div>
                          <p className={['mt-1 text-[10px] text-on-surface-variant', message.mine ? 'text-right' : 'text-left'].join(' ')}>
                            {formatMessageTime(message.sentAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form
                  className="px-4 py-3 border-t border-outline flex items-center gap-2 bg-white"
                  onSubmit={(event) => {
                    event.preventDefault();
                    onSendReply();
                  }}
                >
                  <input
                    type="text"
                    value={replyValue}
                    onChange={(event) => onReplyChange(event.target.value)}
                    placeholder={connected ? '메시지를 입력하세요' : '실시간 연결이 준비되면 메시지를 보낼 수 있어요'}
                    disabled={!connected}
                    className="flex-1 h-11 px-4 rounded-2xl border border-outline text-sm focus:outline-none focus:border-primary disabled:bg-gray-100 disabled:text-on-surface-variant"
                  />
                  <CommonButton
                    type="submit"
                    size="squareLg"
                    variant={canSend ? 'primary' : 'subtle'}
                    disabled={!canSend}
                    className="rounded-2xl"
                    aria-label="회원 메시지 전송"
                  >
                    <span className="material-symbols-outlined text-base">send</span>
                  </CommonButton>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-on-surface-variant px-6 text-center">
                채팅 목록에서 대화를 선택하면 메시지를 확인할 수 있습니다.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
