import React, { useState } from 'react';
import CommonButton from './CommonButton';
import GlobalAiChatbotPanel from './GlobalAiChatbotPanel';
import GlobalMemberMessagePanel from './GlobalMemberMessagePanel';

export default function GlobalAiChatbotButton() {
  const [activePanel, setActivePanel] = useState(null);

  const [aiInputValue, setAiInputValue] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: '안녕하세요! 대타 AI 챗봇입니다. 조건에 맞는 공고를 빠르게 찾아드릴게요.',
    },
  ]);

  const [selectedConversationId, setSelectedConversationId] = useState(1);
  const [memberReply, setMemberReply] = useState('');
  const [memberConversations, setMemberConversations] = useState([
    {
      id: 1,
      name: 'CU 서초중앙점 점장',
      roleLabel: '사업자회원',
      time: '방금',
      preview: '오늘 야간 대타 가능하실까요?',
      messages: [
        { id: 1, mine: false, text: '안녕하세요! 오늘 야간 대타 가능하실까요?' },
        { id: 2, mine: true, text: '네 가능합니다. 근무 시간 다시 한번 확인 부탁드려요.' },
      ],
    },
    {
      id: 2,
      name: '김대타님',
      roleLabel: '개인회원',
      time: '10분 전',
      preview: '면접 일정 조율 가능할까요?',
      messages: [
        { id: 1, mine: false, text: '안녕하세요. 면접 일정 조율 가능할까요?' },
        { id: 2, mine: true, text: '가능합니다. 내일 오후 3시 어떠세요?' },
      ],
    },
  ]);

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

  const submitMemberReply = () => {
    const nextText = memberReply.trim();
    if (!nextText) {
      return;
    }

    setMemberConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== selectedConversationId) {
          return conversation;
        }

        const nextMessages = [...conversation.messages, { id: Date.now(), mine: true, text: nextText }];
        return {
          ...conversation,
          messages: nextMessages,
          preview: nextText,
          time: '방금',
        };
      }),
    );

    setMemberReply('');
  };

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
        <CommonButton
          type="button"
          variant="toggle"
          size="sm"
          fullWidth
          className="justify-start px-3 mt-1"
          inactiveClassName="text-on-surface hover:bg-primary-soft"
          icon={<span className="material-symbols-outlined text-[18px]">forum</span>}
          iconPosition="left"
          onClick={() => setActivePanel('member')}
        >
          회원 메시지함
        </CommonButton>
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
        conversations={memberConversations}
        selectedId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
        replyValue={memberReply}
        onReplyChange={setMemberReply}
        onSendReply={submitMemberReply}
        onClose={() => setActivePanel(null)}
      />

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
    </div>
  );
}

