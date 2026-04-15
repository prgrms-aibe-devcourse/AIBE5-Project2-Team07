import React, { useMemo } from 'react';
import CommonButton from './CommonButton';

export default function GlobalMemberMessagePanel({
  isOpen,
  conversations,
  selectedId,
  onSelectConversation,
  replyValue,
  onReplyChange,
  onSendReply,
  onClose,
}) {
  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedId),
    [conversations, selectedId],
  );

  const canSend = useMemo(() => replyValue.trim().length > 0, [replyValue]);

  return (
    <div
      className={[
        'absolute right-0 w-[calc(100vw-3rem)] max-w-[360px] md:max-w-[420px]',
        'bg-white border border-outline rounded-2xl shadow-2xl overflow-hidden',
        'transition-all duration-200 origin-bottom-right',
        'bottom-20 md:bottom-24',
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none',
      ].join(' ')}
      role="dialog"
      aria-label="개인회원-사업자회원 메시지함"
    >
      <div className="px-4 py-3 border-b border-outline bg-primary-soft/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            forum
          </span>
          <div>
            <p className="text-sm font-bold text-on-surface">회원간 메시지함</p>
            <p className="text-[11px] text-on-surface-variant">개인회원 ↔ 사업자회원 대화</p>
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

      <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] h-[360px]">
        <aside className="border-r border-outline bg-[#FAFAFA] overflow-y-auto">
          {conversations.map((conversation) => {
            const isActive = conversation.id === selectedId;
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className={[
                  'w-full text-left px-3 py-3 border-b border-outline/70 transition-colors',
                  isActive ? 'bg-primary-soft/40' : 'hover:bg-gray-100',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-on-surface truncate">{conversation.name}</p>
                  <span className="text-[10px] text-on-surface-variant">{conversation.time}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1 truncate">{conversation.preview}</p>
              </button>
            );
          })}
        </aside>

        <section className="flex flex-col min-h-0">
          {selectedConversation ? (
            <>
              <div className="px-3 py-2 border-b border-outline bg-white">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-on-surface">{selectedConversation.name}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-soft text-primary font-bold">
                    {selectedConversation.roleLabel}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2 bg-white">
                {selectedConversation.messages.map((message) => (
                  <div key={message.id} className={message.mine ? 'flex justify-end' : 'flex justify-start'}>
                    <div
                      className={[
                        'max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed',
                        message.mine
                          ? 'bg-primary text-white rounded-br-md'
                          : 'bg-gray-100 text-on-surface rounded-bl-md border border-outline',
                      ].join(' ')}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
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
                  className="flex-1 h-10 px-3 rounded-xl border border-outline text-xs focus:outline-none focus:border-primary"
                />
                <CommonButton
                  type="submit"
                  size="square"
                  variant={canSend ? 'primary' : 'subtle'}
                  disabled={!canSend}
                  className="rounded-xl"
                  aria-label="회원 메시지 전송"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                </CommonButton>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-on-surface-variant">
              대화 상대를 선택하세요.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

