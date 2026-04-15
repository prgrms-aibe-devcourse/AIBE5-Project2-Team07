import React from 'react';

const chatJobs = [
  {
    type: 'Emergency Matching',
    title: '[긴급] 강남역 수제버거집 홀 서빙',
    location: '강남구 (역삼동)',
    time: '18:00 - 23:00',
    pay: '시급 13,500원',
    primary: true,
    cta: 'Quick Apply',
  },
  {
    type: 'Verified Matching',
    title: '카페 아르바이트 주방 보조',
    location: '서초구 (강남역 5분)',
    time: '19:00 - 00:00',
    pay: '시급 11,000원',
    primary: false,
    cta: 'View Details',
  },
  {
    type: 'Daily Matching',
    title: '이벤트 행사장 단순 안내 보조',
    location: '강남역 인근 컨벤션',
    time: '18:30 - 22:30',
    pay: '일급 60,000원',
    primary: false,
    cta: 'View Details',
  },
];

export default function AiRecommendChatTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-[calc(100vh-500px)] min-h-[550px]">
      <div className="lg:col-span-7 flex flex-col bg-surface rounded-2xl overflow-hidden border border-outline shadow-sm">
        <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>smart_toy</span>
            </div>
            <div className="space-y-2">
              <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-outline">
                <p className="text-[15px] text-on-surface font-medium leading-relaxed">안녕하세요! 긴급하게 인력이 필요한 공고를 찾고 계신가요? 희망하시는 업무 지역이나 시간대를 말씀해주시면 즉시 매칭해 드릴게요.</p>
              </div>
              <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">AI MATCHING ASSISTANT</span>
            </div>
          </div>

          <div className="flex flex-row-reverse gap-4 max-w-[85%] ml-auto">
            <div className="w-10 h-10 rounded-xl bg-outline/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">person</span>
            </div>
            <div className="space-y-2 text-right">
              <div className="bg-primary text-white p-5 rounded-2xl rounded-tr-none shadow-sm">
                <p className="text-[15px] font-medium leading-relaxed">강남역 인근에서 오늘 오후 6시 이후에 시작하는 단기 알바 있을까요? 서빙이나 단순 보조 업무면 좋습니다.</p>
              </div>
              <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">JUST NOW</span>
            </div>
          </div>

          <div className="flex gap-4 max-w-[85%]">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>smart_toy</span>
            </div>
            <div className="space-y-2">
              <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-outline">
                <p className="text-[15px] text-on-surface font-medium leading-relaxed">네, 강남역 인근의 긴급 공고 3건을 찾았습니다. 모두 오늘 즉시 투입이 필요한 건들이에요. 오른쪽 목록에서 상세 내용을 확인해보세요!</p>
              </div>
              <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">AI MATCHING ASSISTANT</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-outline">
          <div className="flex items-center bg-outline/10 border border-outline rounded-xl px-4 py-1.5 gap-2">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary">add_circle</button>
            <input className="flex-grow bg-transparent border-none focus:ring-0 text-sm py-2" placeholder="Type your matching requirements..." type="text" />
            <button className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xl text-on-surface flex items-center gap-2 uppercase tracking-tight">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>bolt</span>
            Matched Jobs
          </h3>
          <span className="text-[10px] font-black text-primary px-3 py-1 bg-primary-soft rounded-full uppercase tracking-widest">3 New Matches</span>
        </div>

        {chatJobs.map((job) => (
          <div key={job.title} className="bg-white p-7 rounded-2xl border border-outline shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1.5">
                <span className={`text-[10px] font-black tracking-widest uppercase ${job.primary ? 'text-primary' : 'text-on-surface-variant'}`}>{job.type}</span>
                <h4 className="text-lg font-bold leading-tight">{job.title}</h4>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40">{job.primary ? 'notifications_active' : 'bookmark'}</span>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-xs font-semibold"><span className="text-on-surface-variant">위치</span><span className="font-bold text-on-surface">{job.location}</span></div>
              <div className="flex justify-between text-xs font-semibold"><span className="text-on-surface-variant">시간</span><span className="font-bold text-on-surface">{job.time}</span></div>
              <div className="flex justify-between text-xs font-semibold"><span className="text-on-surface-variant">급여</span><span className={`font-bold ${job.primary ? 'text-primary' : 'text-on-surface'}`}>{job.pay}</span></div>
            </div>
            <button className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${job.primary ? 'bg-primary text-white shadow-md shadow-primary/20' : 'border border-outline text-on-surface'}`}>
              {job.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

