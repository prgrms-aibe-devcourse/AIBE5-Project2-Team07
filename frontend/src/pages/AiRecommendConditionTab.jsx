import React from 'react';

const conditionJobs = [
  {
    company: '블루바틀 강남점',
    title: '주말 파트타임 바리스타',
    salary: '시급 13,500원',
    time: '토,일 09:00 - 15:00',
    badge: 'D-0 TODAY',
    rate: 'AI 매칭률 99%',
    urgent: true,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFEfJf-zissEEmAZxB6wUsxepT46nfXRaPWJHvhIeMgLb9l_hmAWVhfz9zTPdBPBGPVR-fb2pfJOWcZsQLmn-Nd4IVFg5chHLxuaKXXhUxiKIEaECDp5roL95wRMISJ7uACvyVDxRxCUpDDDxjWFZMnbYRsOKrZg9HmoeM_Fm6J8yYRcdKNvAMzN9azy-oCNdRnLShTnUywxt5dOMQsAQX3iVwM3_uPRQJ-p_WKzW4ezZFDKRMye1Xfa53r68_hy0K1Fu3i887Q1Q',
  },
  {
    company: '신세계백화점',
    title: 'VIP 라운지 서비스 인턴',
    salary: '시급 11,000원',
    time: '평일 10:00 - 16:00',
    badge: 'D-3',
    rate: 'AI 매칭률 92%',
    urgent: false,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcnTVehb1s8Gukk_pxEal6x_4zWnINtINdgH8rvy5fufH1iOI9RQl16mjl2c1VcDpMfy8tYTWtnSvi5FQTES2cAhJwl5WcCoKpZZIJ8U07DvqnJ1z2rwTtv8lMGGNAl9j0dLZBtGiIOklza5OqDwtZg1ooN-zSmfbIRtzE0f0BsLgABJ-vFiHSorMn2jWIFbGJx_yk131HOrXcS1a1wC29V2cQY6Kgj2ZMR56tdSXJLQMMkOlEQv8-OnogjZ7grdHmagaCi2iFY-c',
  },
];

export default function AiRecommendConditionTab() {
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-12 lg:col-span-7 space-y-8">
        <div className="bg-white p-8 rounded-2xl border border-[#F3F1F0] shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-primary text-white px-3 py-1 font-black text-[10px] rounded uppercase tracking-widest">Step 01</span>
            <h3 className="text-xs uppercase tracking-widest text-primary font-black">직종 선택</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-bold cursor-pointer">외식·음료</span>
            <span className="px-5 py-2.5 bg-white border border-outline text-on-surface rounded-full text-sm font-bold">매장관리·판매</span>
            <span className="px-5 py-2.5 bg-white border border-outline text-on-surface rounded-full text-sm font-bold">서비스</span>
            <span className="px-5 py-2.5 bg-white border border-outline text-on-surface rounded-full text-sm font-bold">사무직</span>
            <span className="px-5 py-2.5 bg-white border border-outline text-on-surface rounded-full text-sm font-bold">생산·건설·노무</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#F3F1F0] shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-primary text-white px-3 py-1 font-black text-[10px] rounded uppercase tracking-widest">Step 02</span>
            <h3 className="text-xs uppercase tracking-widest text-primary font-black">시간/요일 선택</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <button className="bg-white p-4 rounded-xl border border-outline text-sm font-bold">오전 (06~12)</button>
            <button className="bg-primary text-white p-4 rounded-xl text-sm font-bold">오후 (12~18)</button>
            <button className="bg-white p-4 rounded-xl border border-outline text-sm font-bold">저녁 (18~24)</button>
            <button className="bg-white p-4 rounded-xl border border-outline text-sm font-bold">새벽 (24~06)</button>
          </div>
          <div className="flex gap-2">
            <span className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-lg font-bold text-sm">월</span>
            <span className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-lg font-bold text-sm">화</span>
            <span className="w-10 h-10 flex items-center justify-center bg-white border border-outline rounded-lg font-bold text-sm">수</span>
            <span className="w-10 h-10 flex items-center justify-center bg-white border border-outline rounded-lg font-bold text-sm">목</span>
            <span className="w-10 h-10 flex items-center justify-center bg-white border border-outline rounded-lg font-bold text-sm">금</span>
            <span className="w-10 h-10 flex items-center justify-center bg-white border border-outline text-primary rounded-lg font-bold text-sm">토</span>
            <span className="w-10 h-10 flex items-center justify-center bg-white border border-outline text-primary rounded-lg font-bold text-sm">일</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#F3F1F0] shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-primary text-white px-3 py-1 font-black text-[10px] rounded uppercase tracking-widest">Step 03</span>
            <h3 className="text-xs uppercase tracking-widest text-primary font-black">지역 선택</h3>
          </div>
          <div className="flex items-center gap-4 bg-primary-soft p-4 rounded-xl mb-4 border border-primary/10">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <span className="font-bold text-sm text-on-surface">서울 특별시 강남구 역삼동</span>
            <button className="ml-auto text-primary text-xs font-bold">위치 변경</button>
          </div>
          <div className="h-40 bg-outline/20 w-full rounded-xl overflow-hidden relative">
            <img className="w-full h-full object-cover grayscale opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB639Jrf0STBQ8MqHXjGUqPd2jSQmG32T1-Bvw2-n6-VnGzr8i2E38irjiLpDgdvKGk67I7YMo17SoWoWUz2YfnhgXz8FfVAWX_71T_KG-eKV83IUbz80OXkcD-k_1HXAF1kTmjKvq94M9ik6MZS9DGJXQv0vQ9YqQZNXCbDrlV-ZfO4nUfyfpO29f-Kx3RcrKT9TrHnjQ8tFfs1Yizss3Hmt8dy3RZK5zkeSgKgtzi_dKu0yT3AH0TuiXiZ4n5BVgLWNY3ah_TdYc" alt="map" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-xl"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#F3F1F0] shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-primary text-white px-3 py-1 font-black text-[10px] rounded uppercase tracking-widest">Step 04</span>
            <h3 className="text-xs uppercase tracking-widest text-primary font-black">급여 선택</h3>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end px-1">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">최저시급 (9,860원)</span>
              <span className="text-2xl font-black text-primary">시급 12,500원 이상</span>
            </div>
            <input className="w-full h-1.5 bg-outline rounded-lg appearance-none cursor-pointer accent-primary" type="range" defaultValue={70} />
            <div className="flex gap-3">
              <button className="flex-1 py-4 bg-white font-bold rounded-xl border-2 border-primary text-primary text-sm">시급</button>
              <button className="flex-1 py-4 bg-white font-bold rounded-xl border border-outline text-on-surface-variant text-sm">일급</button>
              <button className="flex-1 py-4 bg-white font-bold rounded-xl border border-outline text-on-surface-variant text-sm">월급</button>
            </div>
          </div>
        </div>

        <button className="w-full py-6 bg-primary text-white text-lg font-black rounded-2xl shadow-xl shadow-primary/20 uppercase tracking-widest">
          매칭 공고 확인하기 (124건)
        </button>
      </div>

      <div className="col-span-12 lg:col-span-5 space-y-6">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-2xl font-black text-on-surface tracking-tight uppercase">Matched Jobs</h2>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Sort by: AI Score</span>
        </div>

        <div className="bg-primary p-8 rounded-2xl text-white shadow-xl shadow-primary/20">
          <span className="material-symbols-outlined text-4xl mb-4" style={{ fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
          <h4 className="text-2xl font-black mb-2 leading-tight">AI Matching Tip</h4>
          <p className="text-sm text-white/80">선택하신 역삼동 지역은 현재 다른 지역보다 평균 시급이 10% 높습니다!</p>
        </div>

        <div className="space-y-6">
          {conditionJobs.map((job) => (
            <div key={job.title} className="bg-white p-7 rounded-2xl border border-[#F3F1F0] shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-outline/20 rounded-xl flex items-center justify-center overflow-hidden">
                    <img alt="Company Logo" className="w-full h-full object-cover" src={job.logo} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">{job.company}</p>
                    <h3 className="font-bold text-lg leading-tight">{job.title}</h3>
                  </div>
                </div>
                <span className={`material-symbols-outlined ${job.urgent ? 'text-primary' : 'text-on-surface-variant/40'}`} style={job.urgent ? { fontVariationSettings: '"FILL" 1' } : {}}>
                  {job.urgent ? 'notifications_active' : 'bookmark'}
                </span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">급여</span>
                  <span className={`font-bold ${job.urgent ? 'text-primary' : 'text-on-surface'}`}>{job.salary}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">시간</span>
                  <span className="font-bold text-on-surface">{job.time}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase ${job.urgent ? 'bg-primary text-white' : 'bg-outline/30 text-on-surface-variant'}`}>
                  {job.badge}
                </span>
                <span className="text-[10px] font-bold text-primary">{job.rate}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-4 border border-outline text-on-surface font-extrabold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2">
          Show more matches
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </button>
      </div>
    </div>
  );
}

