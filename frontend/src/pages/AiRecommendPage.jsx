import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import MobileBottomNav from '../components/MobileBottomNav';
import AiRecommendConditionTab from './AiRecommendConditionTab';
import AiRecommendChatTab from './AiRecommendChatTab';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

const resumeJobs = [
  {
    company: '블루바틀 강남점',
    title: '주말 파트타임 바리스타',
    pay: '시급 13,500원',
    time: '토,일 09:00 - 15:00',
    badge: 'D-0 TODAY',
    rate: 'AI 매칭률 99%',
    urgent: true,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFEfJf-zissEEmAZxB6wUsxepT46nfXRaPWJHvhIeMgLb9l_hmAWVhfz9zTPdBPBGPVR-fb2pfJOWcZsQLmn-Nd4IVFg5chHLxuaKXXhUxiKIEaECDp5roL95wRMISJ7uACvyVDxRxCUpDDDxjWFZMnbYRsOKrZg9HmoeM_Fm6J8yYRcdKNvAMzN9azy-oCNdRnLShTnUywxt5dOMQsAQX3iVwM3_uPRQJ-p_WKzW4ezZFDKRMye1Xfa53r68_hy0K1Fu3i887Q1Q',
  },
  {
    company: '신세계백화점',
    title: 'VIP 라운지 서비스 인턴',
    pay: '시급 11,000원',
    time: '평일 10:00 - 16:00',
    badge: 'D-3',
    rate: 'AI 매칭률 92%',
    urgent: false,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcnTVehb1s8Gukk_pxEal6x_4zWnINtINdgH8rvy5fufH1iOI9RQl16mjl2c1VcDpMfy8tYTWtnSvi5FQTES2cAhJwl5WcCoKpZZIJ8U07DvqnJ1z2rwTtv8lMGGNAl9j0dLZBtGiIOklza5OqDwtZg1ooN-zSmfbIRtzE0f0BsLgABJ-vFiHSorMn2jWIFbGJx_yk131HOrXcS1a1wC29V2cQY6Kgj2ZMR56tdSXJLQMMkOlEQv8-OnogjZ7grdHmagaCi2iFY-c',
  },
  {
    company: '나이키 강남',
    title: '매장 운영 및 고객 가이드',
    pay: '시급 10,500원',
    time: '주 4일 탄력근무',
    badge: 'D-7',
    rate: 'AI 매칭률 88%',
    urgent: false,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfQv1R2f_YSUp4vpCtQVRNu7VBMRXcXLNAiUiJxoVhzDGOXgribNveJPGWeuUulwCjUsv9kcp7zUkGsv45aIGc2PM35vgQuzrObWYy0HNemqoFiWHEwSJGJaNp5U5vo6fX7d5g4iyLdWLg2BWYfrpkIzCLd2lP1JS-FQdNMH6tVqs3FyK_LM-RQdzza0uy4Xms2MrtlzP3cjlMmnMsVc-05d2fHeTBmEkEJgIA3m0z11u9qxjJkDPCXpUagTB4UNIOkNcAiNMIY3g',
  },
  {
    company: '토스 센터',
    title: '고객 행복 센터 주말 야간',
    pay: '시급 15,000원',
    time: '토,일 22:00 - 06:00',
    badge: 'D-0 TODAY',
    rate: 'AI 매칭률 85%',
    urgent: true,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsbAOuWzKO9VyNoXww0RuOZAbhZIZcqiBje4caItWVxGaNHeByv6L8ZMYttO7IP1A5EpbIvfTeoM3SL3QpMErKROlvA7toaoxwzWzigJKBEiStWERW1Vq28WMCEoSWfjVDBeuvfk3U0rza3FunaNZOFCxgWmjthx2YRd0P0O-aWIjMCi5BXLtzGbIGWeDpW_i0QOj4MsP08IXnxZRpOr6Yff0meaj3j4hKUVeNhFPIg6IOkwC1t86TF5nh0r1Lnye8ZJuamvJ2ogw',
  },
];

const tabs = [
  { key: 'resume', label: '이력서 기반 추천' },
  { key: 'condition', label: '조건 선택 추천' },
  { key: 'chat', label: '채팅 AI 추천' },
];

export default function AiRecommendPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'resume';

  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: 'resume' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const setTab = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  return (
    <>
      <TopNavBar />
      <main className="flex-grow pt-32 pb-20 custom-container w-full">
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold text-on-surface mb-4 tracking-tighter">
            나에게 딱 맞는 알바, <span className="text-primary italic">대타 </span>가 찾아드려요
          </h1>
          <p className="text-lg text-on-surface-variant font-medium">
            {currentTab === 'condition'
              ? '상세한 조건을 선택하시면 AI가 가장 긴급한 공고를 먼저 찾아드립니다.'
              : '사용자의 성향과 경력을 분석하여 최적의 근무지를 0.1초 만에 매칭합니다.'}
          </p>
        </header>

        <div className="flex gap-4 mb-12 flex-wrap">
          {tabs.map((tab) => (
            <CommonButton
              key={tab.key}
              onClick={() => setTab(tab.key)}
              variant="toggle"
              size="tab"
              active={currentTab === tab.key}
              activeClassName="bg-primary-soft text-primary shadow-sm"
              inactiveClassName="bg-outline/20 text-on-surface-variant hover:bg-outline/40"
            >
              {tab.label}
            </CommonButton>
          ))}
        </div>

        <section className={currentTab === 'resume' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-outline shadow-sm">
                <h3 className="text-xs uppercase tracking-widest text-primary font-black mb-6">User Profile Analysis</h3>
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold block mb-2">Skills & Industry</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary-soft text-primary text-xs font-bold rounded-full">#바리스타</span>
                      <span className="px-3 py-1 bg-primary-soft text-primary text-xs font-bold rounded-full">#라떼아트</span>
                      <span className="px-3 py-1 bg-primary-soft text-primary text-xs font-bold rounded-full">#고객응대</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold block mb-1">Preferred Time</span>
                      <p className="text-sm font-bold text-on-surface">주말 오전 (08:00 - 14:00)</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold block mb-1">Target Salary</span>
                      <p className="text-sm font-bold text-on-surface">시급 12,000원 이상</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold block mb-1">Desired Address</span>
                    <p className="text-sm font-bold flex items-center gap-1 text-on-surface">
                      <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                      서울특별시 강남구 역삼동
                    </p>
                  </div>
                </div>
                <button className="w-full mt-8 py-4 border border-outline text-on-surface font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary-soft hover:border-primary/30 hover:text-primary transition-all">
                  이력서 수정하기
                </button>
              </div>

              <div className="bg-primary p-8 rounded-2xl text-white shadow-xl shadow-primary/20">
                <span className="material-symbols-outlined text-4xl mb-4" style={{ fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
                <h4 className="text-2xl font-black mb-2 leading-tight">98% 매칭 정확도</h4>
                <p className="text-sm text-white/80">현재 2,451개의 일자리가 당신의 조건과 완벽하게 일치합니다.</p>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-2xl font-black text-on-surface tracking-tight uppercase">Matched Jobs</h2>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Sort by: AI Score</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {resumeJobs.map((job) => (
                  <div key={job.title} className="bg-white p-7 rounded-2xl border border-outline shadow-sm hover:shadow-md">
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
                      <div className="flex justify-between text-xs font-semibold"><span className="text-on-surface-variant">급여</span><span className={`font-bold ${job.urgent ? 'text-primary' : 'text-on-surface'}`}>{job.pay}</span></div>
                      <div className="flex justify-between text-xs font-semibold"><span className="text-on-surface-variant">시간</span><span className="font-bold text-on-surface">{job.time}</span></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase ${job.urgent ? 'bg-primary text-white' : 'bg-outline/30 text-on-surface-variant'}`}>{job.badge}</span>
                      <span className="text-[10px] font-bold text-primary">{job.rate}</span>
                    </div>
                  </div>
                ))}
              </div>

              <CommonButton
                variant="outline"
                size="fullLg"
                className="mt-10 uppercase tracking-widest font-extrabold"
                icon={<span className="material-symbols-outlined">expand_more</span>}
              >
                Show more matches
              </CommonButton>
            </div>
          </div>
        </section>

        <section className={currentTab === 'condition' ? 'block' : 'hidden'}>
          <AiRecommendConditionTab />
        </section>

        <section className={currentTab === 'chat' ? 'block' : 'hidden'}>
          <AiRecommendChatTab />
        </section>
      </main>

      <AppFooter />


      <MobileBottomNav />
    </>
  );
}

