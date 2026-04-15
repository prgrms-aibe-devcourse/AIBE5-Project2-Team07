import React, { useMemo } from 'react';
import CommonButton from './CommonButton';

export default function GlobalAiChatbotPanel({
  isOpen,
  messages,
  inputValue,
  onInputChange,
  onSend,
  onClose,
  onQuickAction,
}) {
  const canSend = useMemo(() => inputValue.trim().length > 0, [inputValue]);

  return (
    <div
      className={[
        'absolute right-0 w-[calc(100vw-3rem)] max-w-[360px] md:max-w-[380px]',
        'bg-white border border-outline rounded-2xl shadow-2xl overflow-hidden',
        'transition-all duration-200 origin-bottom-right',
        'bottom-20 md:bottom-24',
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none',
      ].join(' ')}
      role="dialog"
      aria-label="대타 AI 챗봇 메시지함"
    >
      <div className="px-4 py-3 border-b border-outline bg-primary-soft/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            smart_toy
          </span>
          <div>
            <p className="text-sm font-bold text-on-surface">대타 AI 챗봇</p>
            <p className="text-[11px] text-on-surface-variant">평균 응답 10초</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="챗봇 닫기"
          className="text-on-surface-variant hover:text-primary transition-colors"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="px-4 pt-4 pb-3 h-[320px] overflow-y-auto bg-white space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={[
                'max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed',
                message.role === 'user'
                  ? 'bg-primary text-white rounded-br-md'
                  : 'bg-gray-100 text-on-surface rounded-bl-md border border-outline',
              ].join(' ')}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pt-3 pb-3 flex gap-2 flex-wrap border-t border-outline bg-white">
        <CommonButton variant="soft" size="sm" className="text-xs" onClick={() => onQuickAction('오늘 가능한 공고 추천해줘')}>
          오늘 가능한 공고
        </CommonButton>
        <CommonButton variant="soft" size="sm" className="text-xs" onClick={() => onQuickAction('내 근처 긴급 공고만 보여줘')}>
          근처 긴급 공고
        </CommonButton>
      </div>

      <form
        className="px-3 pb-3 flex items-center gap-2 bg-white"
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="대타에게 메시지를 입력하세요"
          className="flex-1 h-11 px-3 rounded-xl border border-outline text-sm focus:outline-none focus:border-primary"
        />
        <CommonButton
          type="submit"
          size="square"
          variant={canSend ? 'primary' : 'subtle'}
          disabled={!canSend}
          className="rounded-xl"
          aria-label="메시지 전송"
        >
          <span className="material-symbols-outlined text-base">send</span>
        </CommonButton>
      </form>
    </div>
  );
}

