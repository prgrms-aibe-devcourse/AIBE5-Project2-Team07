import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopNavBarLoggedIn from '../components/TopNavBarLoggedIn';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

const sidebarItems = [
  { id: 'dashboard', label: '대시보드', icon: 'dashboard' },
  { id: 'recruits', label: '공고 관리', icon: 'assignment' },
  { id: 'applicants', label: '지원자 현황', icon: 'group' },
  { id: 'reviews', label: '리뷰 관리', icon: 'rate_review' },
  { id: 'work', label: '근무 관리', icon: 'calendar_today' },
];

const validTabs = new Set(sidebarItems.map((item) => item.id));

function BusinessMyPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');
  const activeTab = validTabs.has(queryTab) ? queryTab : 'dashboard';

  const changeTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-on-surface">
      <TopNavBarLoggedIn />

      <div className="pt-20 min-h-screen">
        <div className="custom-container py-8 flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-outline p-6 sticky top-28">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 bg-primary-soft rounded-2xl flex items-center justify-center mb-4 border border-primary/10">
                  <span className="material-symbols-outlined text-4xl text-primary">apartment</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <h2 className="font-bold text-lg">서울 에디토리얼</h2>
                  <span
                    className="material-symbols-outlined text-primary text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">사업자번호 123-45-67890</p>
                <CommonButton
                  type="button"
                  onClick={() => navigate('/dashboard/recruit-create')}
                  size="full"
                  className="mt-4"
                  icon={<span className="material-symbols-outlined text-sm">add</span>}
                >
                  공고 등록하기
                </CommonButton>
                <CommonButton
                  type="button"
                  variant="subtle"
                  size="sm"
                  fullWidth
                  className="mt-2 text-xs"
                  onClick={() => navigate('/dashboard/company-edit')}
                >
                  기업 정보 수정
                </CommonButton>
              </div>

              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = item.id === activeTab;
                  return (
                    <CommonButton
                      key={item.id}
                      type="button"
                      onClick={() => changeTab(item.id)}
                      variant="toggle"
                      size="tab"
                      fullWidth
                      active={isActive}
                      activeClassName="bg-primary-soft text-primary font-bold"
                      inactiveClassName="text-on-surface-variant hover:bg-gray-50"
                      className="justify-start px-4"
                      icon={<span className="material-symbols-outlined text-[20px]">{item.icon}</span>}
                      iconPosition="left"
                    >
                      {item.label}
                    </CommonButton>
                  );
                })}
                <CommonButton
                  type="button"
                  variant="toggle"
                  size="tab"
                  fullWidth
                  inactiveClassName="text-on-surface-variant hover:bg-gray-50"
                  className="justify-start px-4"
                  icon={<span className="material-symbols-outlined text-[20px]">logout</span>}
                  iconPosition="left"
                >
                  로그아웃
                </CommonButton>
              </nav>

              <div className="mt-8 pt-6 border-t border-outline">
                <button className="text-xs text-on-surface-variant hover:text-primary transition-colors">회원 탈퇴하기</button>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'recruits' && <RecruitsTab />}
            {activeTab === 'applicants' && <ApplicantsTab />}
            {activeTab === 'reviews' && <ReviewsTab />}
            {activeTab === 'work' && <WorkTab />}
          </main>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}

function DashboardTab() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-outline rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">bolt</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant mb-0.5">활성 공고</p>
            <p className="text-xl font-black">
              04 <span className="text-sm font-medium text-on-surface-variant">건</span>
            </p>
          </div>
        </div>
        <div className="bg-white border border-outline rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant mb-0.5">평균 평점</p>
            <p className="text-xl font-black">
              4.8 <span className="text-sm font-medium text-on-surface-variant">/ 5.0</span>
            </p>
          </div>
        </div>
        <div className="bg-white border border-outline rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500">receipt_long</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant mb-0.5">결제 내역</p>
            <p className="text-xl font-black">
              2일 전 <span className="text-sm font-medium text-on-surface-variant">최근</span>
            </p>
          </div>
        </div>
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">공고 관리</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-outline text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">전체</button>
            <button className="px-3 py-1 bg-white border border-outline text-xs font-medium rounded-lg text-on-surface-variant hover:bg-gray-50 transition-colors">
              진행중
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white border border-outline rounded-2xl p-5 hover:border-primary/30 transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">history_edu</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-primary bg-primary-soft px-1.5 py-0.5 rounded">급구</span>
                    <span className="text-[10px] font-bold text-on-surface-variant">영상편집</span>
                  </div>
                  <h4 className="font-bold group-hover:text-primary transition-colors">뉴스 속보 전문 시니어 영상 편집자 구인</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">2시간 전 등록 • 서울 강남구</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">지원자</p>
                  <p className="text-xl font-black">12</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">edit</span>
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">analytics</span>
                  </button>
                  <button className="p-2 rounded-lg hover:bg-primary-soft transition-colors">
                    <span className="material-symbols-outlined text-sm text-primary">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-outline rounded-2xl p-5 opacity-70 hover:opacity-100 transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant">closed_caption</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-on-surface-variant border border-outline px-1.5 py-0.5 rounded">마감</span>
                  </div>
                  <h4 className="font-bold">영어 자막 번역 전문가 (단기)</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">3일 전 마감 • 재택근무</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">지원자</p>
                  <p className="text-xl font-black">45</p>
                </div>
                <button className="px-4 py-2 bg-on-surface text-white text-xs font-bold rounded-lg hover:bg-primary transition-colors">재등록</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">최근 리뷰</h3>
          <button className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">전체 보기</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-outline rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-0.5">
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <span className="text-[10px] text-on-surface-variant font-medium">2024.03.15</span>
            </div>
            <p className="text-sm font-semibold leading-relaxed mb-4">
              "지급이 정말 빠르고 요청 사항이 매우 명확해서 좋았습니다. 급한 프로젝트가 있을 때 믿고 함께할 수 있습니다."
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center text-[10px] font-bold text-primary">JK</div>
                <span className="text-xs font-bold text-on-surface-variant">김제임스</span>
              </div>
              <button className="text-primary font-bold text-[11px] flex items-center gap-1">
                답글 달기 <span className="material-symbols-outlined text-xs">reply</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-outline rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-0.5">
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-gray-200 text-[16px]">star</span>
              </div>
              <span className="text-[10px] text-on-surface-variant font-medium">2024.03.10</span>
            </div>
            <p className="text-sm font-semibold leading-relaxed mb-4">
              "편집 과정 전반에 걸쳐 프로페셔널한 환경과 훌륭한 소통이 인상적이었습니다."
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-400">SP</div>
                <span className="text-xs font-bold text-on-surface-variant">박사라</span>
              </div>
              <span className="text-on-surface-variant font-bold text-[11px] bg-gray-50 px-2 py-0.5 rounded flex items-center gap-1">
                답변 완료
                <span className="material-symbols-outlined text-xs text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function RecruitsTab() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-on-surface">공고 관리</h1>
          <p className="text-sm text-on-surface-variant">작성하신 긴급 공고 현황을 확인하고 지원자를 관리하세요.</p>
        </div>
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
          <input
            className="w-full bg-white border border-outline rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            placeholder="공고명 검색"
            type="text"
          />
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-outline rounded-2xl p-5">
          <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">전체 공고</p>
          <p className="text-2xl font-black text-on-surface">12</p>
        </div>
        <div className="bg-white border border-outline rounded-2xl p-5 border-l-4 border-l-primary">
          <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">진행 중</p>
          <p className="text-2xl font-black text-primary">3</p>
        </div>
        <div className="bg-white border border-outline rounded-2xl p-5">
          <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">마감됨</p>
          <p className="text-2xl font-black text-on-surface">9</p>
        </div>
        <div className="bg-white border border-outline rounded-2xl p-5">
          <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">새 지원자</p>
          <p className="text-2xl font-black text-[#6c46ad]">14</p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              notifications_active
            </span>
            진행 중인 공고
          </h3>

          <div className="space-y-3">
            <div className="bg-white border border-outline rounded-2xl p-5 hover:border-primary/30 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-soft rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmg3hq1M_wXu6VyacpgIfRDhz5ai3HoBcIwfjGqIqhHG0zXABC7C-neG1a9WCcyTHrW7kwLhKrqriS5nuZi4uHwZOZLReo0WF_FXkm8RA4PYHjIr0-_tA1Xbc0VtERJ_ln0IgHwcECFUWiI0vvvDSLSOF6keekE9TQthGf3mDHSiVRBJah2HHugqB4U3M-QzJUCBbFldsFRJIZO2uZeB4-7iRuaZljSzMJF3wd6ydFipQidEdxeGsfJLt3HZjYvcDvXG9wuPRDPik"
                      alt="공고 이미지"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary bg-primary-soft px-1.5 py-0.5 rounded">RECRUITING</span>
                      <span className="text-[10px] font-medium text-on-surface-variant">등록일: 2024.05.20</span>
                    </div>
                    <h4 className="font-bold group-hover:text-primary transition-colors text-base md:text-lg">[강남] 투썸플레이스 주말 오픈 파트타임 긴급 구인</h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">payments</span> 시급 12,500원
                      </span>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span> 08:00 ~ 14:00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">지원자</p>
                    <p className="text-xl font-black">
                      8<span className="text-xs font-medium ml-0.5 text-on-surface-variant">명</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-deep transition-colors">지원자 확인</button>
                    <button className="p-2 bg-gray-50 border border-outline rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="material-symbols-outlined text-sm text-on-surface-variant">more_vert</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-outline rounded-2xl p-5 hover:border-primary/30 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-soft rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt8q8FXKPkOg4ghPWgX2KjIlfb9-emaAq4jZTCdwUVEp0DB5Zm7qlAdDsqmgHgtFmsiV424Cmrsfat9t7XBdmZLZKihG3n2raQVg171qa6Br-uYtuixUzBIxK_3UvwakI4wPBhwzN1xoakqGaYRdvaKIDmdSXUzUCwoN2SXk8hUeqoRlnrUT5BixXKfyr8G21TXVxJbSopEL8YctbGhRYonix5xLGaJWum4Sw2gMxZwE_urgCFQdBxKqlemWSYm0yKZDsUM2X6Als"
                      alt="공고 이미지"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary bg-primary-soft px-1.5 py-0.5 rounded">RECRUITING</span>
                      <span className="text-[10px] font-medium text-on-surface-variant">등록일: 2024.05.21</span>
                    </div>
                    <h4 className="font-bold group-hover:text-primary transition-colors text-base md:text-lg">CJ대한통운 물류센터 단순 상하차 (당일지급)</h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">payments</span> 일급 110,000원
                      </span>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span> 19:00 ~ 03:00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">지원자</p>
                    <p className="text-xl font-black">
                      5<span className="text-xs font-medium ml-0.5 text-on-surface-variant">명</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-deep transition-colors">지원자 확인</button>
                    <button className="p-2 bg-gray-50 border border-outline rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="material-symbols-outlined text-sm text-on-surface-variant">more_vert</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-outline">
          <h3 className="text-lg font-bold text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined">history</span>
            마감된 공고
          </h3>

          <div className="space-y-3">
            <div className="bg-white border border-outline rounded-2xl p-5 opacity-70 hover:opacity-100 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden grayscale flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuGSeNRUPViFsmbhc5BIhwMQH8kpNffRv1IfKAJkfI-6gB_EFJpTRogapYvqi_sBYU91BphVovlg8oHghdQM7QnllNqvqWBv6hQWte5TFxznlQl9pREiVZtN1TttQNh4HRcDxug9U7ai2YJfQBVIXzyP0ym5Q6ghaRWGh_SXsnJHR7XPG45c2fxQZ5wcwyc0qvfcNXdQKcqXti8U0_-XoZqeCR1BiMb-EVckVQ4t2pQz9OtCN2FYFMYw_CaxWc0D2ihr-ppW3E2uY"
                      alt="마감 공고 이미지"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-on-surface-variant border border-outline px-1.5 py-0.5 rounded">CLOSED</span>
                      <span className="text-[10px] font-medium text-on-surface-variant">마감일: 2024.05.15</span>
                    </div>
                    <h4 className="font-bold text-on-surface-variant line-through text-base md:text-lg">역전할머니맥주 주방 보조 (평일 석식)</h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">payments</span> 시급 11,000원
                      </span>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">group</span> 최종 채용: 2명
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">지원자</p>
                    <p className="text-xl font-black">
                      24<span className="text-xs font-medium ml-0.5">명</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-50 text-on-surface-variant text-xs font-bold rounded-lg border border-outline hover:bg-gray-100 transition-colors">기록 보기</button>
                    <button className="px-4 py-2 bg-on-surface text-white text-xs font-bold rounded-lg hover:bg-primary transition-colors">재등록</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-outline rounded-2xl p-5 opacity-70 hover:opacity-100 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden grayscale flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbupdBkXk1EAHtFN_UisT0GUCk7V1GI2_tZF17PKBvXyhwg2AoPzt0hzn506LsBnw6FOioOjT3Yz3e5VVwmnOsvEK9v0EwAj8zenDh1SfVue8jjzj70DlQOWcntw6OnNx7H4HgZJnP-DvXdWiFZdVYZz5mp-Dz7HikTH61RwkG1Tu1FxfLzg7uSsSBDvTjkXEgZ-pljr7h4sQGUspxwUwIl2aCof-abeUjA-ElfujL3YXwtC-vfa7_9PBi69pj17xCf6lGBWE17FQ"
                      alt="마감 공고 이미지"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-on-surface-variant border border-outline px-1.5 py-0.5 rounded">CLOSED</span>
                      <span className="text-[10px] font-medium text-on-surface-variant">마감일: 2024.05.10</span>
                    </div>
                    <h4 className="font-bold text-on-surface-variant line-through text-base md:text-lg">스타트업 오피스 야간 미화원 긴급</h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">payments</span> 시급 15,000원
                      </span>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">group</span> 최종 채용: 1명
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">지원자</p>
                    <p className="text-xl font-black">
                      12<span className="text-xs font-medium ml-0.5">명</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-50 text-on-surface-variant text-xs font-bold rounded-lg border border-outline hover:bg-gray-100 transition-colors">기록 보기</button>
                    <button className="px-4 py-2 bg-on-surface text-white text-xs font-bold rounded-lg hover:bg-primary transition-colors">재등록</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ApplicantsTab() {
  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Management</span>
          <h2 className="text-2xl font-black text-on-surface">지원자 현황</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white border border-outline px-4 py-2 rounded-lg text-on-surface text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            정렬 방식
          </button>
          <button className="bg-primary px-6 py-2 rounded-lg text-white text-sm font-bold hover:bg-primary-deep transition-colors">공고 수정</button>
        </div>
      </header>

      <section className="bg-white border border-outline rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-primary-soft text-primary text-[10px] font-bold rounded">급구</span>
              <span className="text-on-surface-variant text-xs font-medium">서울 강남구 • 공고번호 #8291</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">강남역 인근 카페 주말 마감 파트타임 (급구)</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-lg">group</span>
                <span className="text-xs font-bold">지원자 12명</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  circle_notifications
                </span>
                <span className="text-xs font-bold">신규 지원 3명</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-tight">마감일</span>
            <span className="text-lg font-black text-on-surface">2024.12.31</span>
          </div>
        </div>
      </section>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        <button className="px-4 py-2 bg-white border border-primary text-primary text-xs font-bold rounded-full transition-all">전체 (12)</button>
        <button className="px-4 py-2 bg-white border border-outline text-on-surface-variant text-xs font-medium rounded-full hover:bg-gray-50 transition-all">대기중 (5)</button>
        <button className="px-4 py-2 bg-white border border-outline text-on-surface-variant text-xs font-medium rounded-full hover:bg-gray-50 transition-all">면접 조율 (4)</button>
        <button className="px-4 py-2 bg-white border border-outline text-on-surface-variant text-xs font-medium rounded-full hover:bg-gray-50 transition-all">채용 완료 (3)</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="bg-white border border-outline rounded-2xl p-5 hover:border-primary/30 transition-all group flex flex-col h-full">
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-3">
              <img
                className="w-14 h-14 rounded-xl object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUYkJJiOtrxJpT_NTH-Hd7Kpx9Av60eRHz5yrJB22fQQkwUWHqmTrQnAYgtIM3gIqAZ9R1NuJ6KXqboql7vWLBx5SaV7DQbOcZu0eSY56kbMXZ8ST4PjHYLqvOc6lNpK5PKwOzA9nu4Z-hshKPEetmWzBmnvi2GRLv05tw8xv9mfrkACGxxmdJS-cYXt-kZwKk4XzxHiOjsTcspLUgAQiFPsvkcHNaDr-NkpDU6vksrVhzX1hj3HcSCsTQb7GB7kAJOCfrz6Sa8Fw"
                alt="지원자 프로필"
              />
              <div>
                <h4 className="font-bold text-base">김태호</h4>
                <p className="text-[10px] text-on-surface-variant">지원일: 2024.10.24</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-bold rounded uppercase">Hired</span>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-[9px] font-bold text-primary uppercase tracking-tight">Experience Summary</span>
              <p className="text-[13px] text-on-surface leading-snug mt-1 font-medium line-clamp-2">프랜차이즈 카페 마감 경력 2년, 라떼 아트 가능, 보건증 소지</p>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 bg-gray-50 border border-outline text-[10px] font-medium text-on-surface-variant rounded">경력직</span>
              <span className="px-2 py-0.5 bg-gray-50 border border-outline text-[10px] font-medium text-on-surface-variant rounded">즉시출근</span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button className="flex-1 py-2 text-xs font-bold bg-gray-50 border border-outline text-on-surface rounded-lg hover:bg-gray-100 transition-colors">프로필 보기</button>
            <button className="flex-1 py-2 text-xs font-bold bg-gray-50 border border-outline text-on-surface rounded-lg hover:bg-gray-100 transition-colors">연락하기</button>
          </div>
        </div>

        <div className="bg-white border border-outline rounded-2xl p-5 hover:border-primary/30 transition-all group flex flex-col h-full">
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-3">
              <img
                className="w-14 h-14 rounded-xl object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNEDcHQm5qDMuW5_i5w7YN_YIK1BlS4DaDKahI0Jeb0Df58EVwuW4QH8UKR25uTJ6zVhMHy7YSUd_zGhaIoChyhYTr1PCn2mBaTHl4kbFt80t5cWxSlhnc8nzIodGGw6Fv2_9fUNAeOFbcDrIMnJ5BLPbwjVe3YqpZz-RNDkNYotxXQAE8_oexzplCvB3vYQ6dURGnK1DWEG6UAZ5Uut_z7ASsR24V7dq0yndWvrF6QUg-hSIXVCf_3AQ_eKqUShxRiCKfQ4nK3eo"
                alt="지원자 프로필"
              />
              <div>
                <h4 className="font-bold text-base">이지윤</h4>
                <p className="text-[10px] text-on-surface-variant">지원일: 2024.10.25</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded uppercase">Interview</span>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-[9px] font-bold text-primary uppercase tracking-tight">Experience Summary</span>
              <p className="text-[13px] text-on-surface leading-snug mt-1 font-medium line-clamp-2">개인 카페 오픈 멤버, 베이커리 서빙 경험 1년, 인근 거주자</p>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 bg-gray-50 border border-outline text-[10px] font-medium text-on-surface-variant rounded">신입가능</span>
              <span className="px-2 py-0.5 bg-gray-50 border border-outline text-[10px] font-medium text-on-surface-variant rounded">장기희망</span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button className="flex-1 py-2 text-xs font-bold bg-gray-50 border border-outline text-on-surface rounded-lg hover:bg-gray-100 transition-colors">프로필 보기</button>
            <button className="flex-1 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary-deep transition-colors">채용 확정</button>
          </div>
        </div>

        <div className="bg-white border-2 border-primary-soft rounded-2xl p-5 hover:border-primary/30 transition-all group flex flex-col h-full relative">
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-400 text-3xl">person</span>
              </div>
              <div>
                <h4 className="font-bold text-base">박민재</h4>
                <p className="text-[10px] text-primary font-bold">NEW • 3시간 전</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-gray-100 text-on-surface-variant text-[9px] font-bold rounded uppercase">Pending</span>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-[9px] font-bold text-primary uppercase tracking-tight">Experience Summary</span>
              <p className="text-[13px] text-on-surface leading-snug mt-1 font-medium line-clamp-2">레스토랑 주방 보조 및 홀 서빙 병행 경력 3년, 밝고 성실함</p>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 bg-gray-50 border border-outline text-[10px] font-medium text-on-surface-variant rounded">경력직</span>
              <span className="px-2 py-0.5 bg-gray-50 border border-outline text-[10px] font-medium text-on-surface-variant rounded">주말가능</span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button className="flex-1 py-2 text-xs font-bold bg-gray-50 border border-outline text-on-surface rounded-lg hover:bg-gray-100 transition-colors">프로필 보기</button>
            <button className="flex-1 py-2 text-xs font-bold bg-gray-50 border border-outline text-on-surface rounded-lg hover:bg-gray-100 transition-colors">면접 제안</button>
          </div>
        </div>
      </div>

      <div className="mt-12 mb-8 flex flex-col items-center">
        <button className="group flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase group-hover:text-primary transition-colors">
            Load More Applicants
          </span>
          <span className="material-symbols-outlined text-primary text-2xl group-hover:translate-y-1 transition-transform">keyboard_double_arrow_down</span>
        </button>
      </div>
    </>
  );
}

function ReviewsTab() {
  const [reviewTab, setReviewTab] = React.useState('received');

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-1">리뷰 관리</h1>
        <p className="text-on-surface-variant text-sm">
          {reviewTab === 'received'
            ? '직원들로부터 받은 소중한 의견을 확인하고 소통하세요.'
            : '직원 평가 리뷰를 관리하세요.'}
        </p>
      </header>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 border-b border-outline mb-8">
        <CommonButton
          onClick={() => setReviewTab('received')}
          variant="toggle"
          size="tab"
          active={reviewTab === 'received'}
          activeClassName="text-primary"
          inactiveClassName="text-on-surface-variant hover:text-on-surface"
          className="relative rounded-none px-6"
        >
          내가 받은 리뷰
          {reviewTab === 'received' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </CommonButton>
        <CommonButton
          onClick={() => setReviewTab('written')}
          variant="toggle"
          size="tab"
          active={reviewTab === 'written'}
          activeClassName="text-primary"
          inactiveClassName="text-on-surface-variant hover:text-on-surface"
          className="relative rounded-none px-6"
        >
          내가 쓴 리뷰
          {reviewTab === 'written' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </CommonButton>
      </div>

      {/* 내가 받은 리뷰 탭 */}
      {reviewTab === 'received' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white border border-outline rounded-2xl p-6 flex items-center gap-6 border-l-4 border-l-primary">
              <div className="flex flex-col">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">평균 별점</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black">4.8</span>
                  <span className="text-sm font-medium text-on-surface-variant">/ 5.0</span>
                </div>
                <div className="flex mt-2 text-primary">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-outline rounded-2xl p-6 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">최근 리텐션</p>
                <p className="text-sm font-bold text-on-surface">지원자의 92%가 다시 근무하기를 희망합니다.</p>
              </div>
              <div className="w-16 h-16 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-gray-100" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6" />
                  <circle
                    className="text-primary"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="28"
                    stroke="currentColor"
                    strokeDasharray="175.9"
                    strokeDashoffset="14"
                    strokeWidth="6"
                  />
                </svg>
                <span className="absolute text-sm font-black">92%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-on-surface">전체 리뷰 (24)</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-white border border-outline text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">최신순</button>
                <button className="px-3 py-1 bg-white border border-outline text-xs font-medium rounded-lg text-on-surface-variant hover:bg-gray-50 transition-colors">평점순</button>
              </div>
            </div>

            <div className="bg-white border border-outline rounded-2xl p-6 border-l-4 border-l-primary hover:border-primary/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-outline">
                    <img
                      alt="User"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKF2IE7RsYv-Rg8YYkPHIs0ZPkU-CU3JlAXQG8FIfvtk7qMs8BIovrKaoXOkXotiF14noBGmdFt0--U0jCQ_aRPXoLRSz1HbW9iXQHQ-v2urh_uEB_muksGp_O5yDQoLJfNMHue-oNV7ToMLixhknM6G48zfaFZO62bG5urR8gJ8GER_ntDXh3oFLcrvGNMcMsCrJY8pzyAWrIJN0iWhdBQZX1b2o7S13SAmVXMjElY0fXGQv0SjGl46V6pY8dn_VIYWoxIKs7jkk"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">김지수 님</span>
                      <span className="text-[10px] text-on-surface-variant">홀서빙 알바 (2024.03.15 근무)</span>
                    </div>
                    <div className="flex text-primary">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-on-surface-variant font-medium">방금 전</span>
              </div>
              <p className="text-sm font-medium leading-relaxed mb-4">
                "사장님께서 너무 친절하게 업무를 가르쳐주셔서 첫 근무였음에도 빠르게 적응할 수 있었습니다. 매장 분위기도 좋고 급여 정산도 정확하게 이루어져서 다음에도 기회가 되면 꼭 다시 일하고 싶습니다!"
              </p>
              <div className="flex justify-end pt-2 border-t border-outline/50">
                <button className="text-primary font-bold text-[11px] flex items-center gap-1 hover:underline">
                  답글 달기 <span className="material-symbols-outlined text-xs">reply</span>
                </button>
              </div>
            </div>

            <div className="bg-white border border-outline rounded-2xl p-6 border-l-4 border-l-gray-200 hover:border-primary/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-outline">
                    <img
                      alt="User"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdrKclyQe_TBwvuBex5aKNvlzMXrWrV34D5hsjrQHYkEqtUxI3rPT9hPf5hU41x5FllaifG-Fl-XJcvjdLN8qfZn3E4rfN04cMb23FCGwy0pFFc5uATDlUcVMwAYWu12Ca7EDkSTvl0TqYOt5V2ZpevdIjsAYlbwgH9S4EwVVag_Zj8yWCo4KTEslDsFeJOPbPyNgSywGXFlZdq62lhRn6ArJHn4xeLOg-yNGt4xOwDna6WYduMDMDfNRAObQd-leUdoNndWY__e4"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">박민지 님</span>
                      <span className="text-[10px] text-on-surface-variant">주방 보조 (2024.03.12 근무)</span>
                    </div>
                    <div className="flex text-primary">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-on-surface-variant font-medium">2일 전</span>
              </div>
              <p className="text-sm font-medium leading-relaxed mb-4">
                "업무 강도는 적당했고 무엇보다 휴게 시간을 정확하게 지켜주시는 점이 좋았습니다. 주방 청결 상태도 우수해서 일하는 동안 쾌적했습니다."
              </p>
              <div className="p-4 bg-gray-50 rounded-xl mb-4 flex gap-3 border border-outline/30">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                  subdirectory_arrow_right
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[11px] text-on-surface">매장 관리자</span>
                    <span className="text-[9px] text-on-surface-variant">2일 전</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">소중한 의견 감사합니다, 박민지 님! 다음에 또 뵙기를 기대하겠습니다.</p>
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-outline/50">
                <button className="text-on-surface-variant font-bold text-[11px] hover:text-on-surface transition-colors">수정하기</button>
              </div>
            </div>

            <div className="bg-white border border-outline rounded-2xl p-6 border-l-4 border-l-gray-200 hover:border-primary/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-outline">
                    <img
                      alt="User"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxCjeRi2fXyZ2eomcieYXlcsAWOrx7pXMlnYoDYzeOVhzrfq2xCBDVGh9N8XgIYB_zX-NIziuuUg2rJqQV94sRdfc-skZ9SJb8Bk-S3GzrxL9bToRBXadOZUWhaUdhHBNdViX3ciK0oGSjzesWW12YeRpH2Kr0k_EJO0ZHEIEJPWKZS3Fr6uO5W1D-WpwwNv5VMPqhDodLoSYQUvP73k1YSt51hotp1Bm7iXL1N1H-tIYh_QYLY6reKz4HEM6FaDugPC-FpztCQ7s"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm">이태윤 님</span>
                      <span className="text-[10px] text-on-surface-variant">물류 상하차 (2024.03.10 근무)</span>
                    </div>
                    <div className="flex text-primary">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-on-surface-variant font-medium">5일 전</span>
              </div>
              <p className="text-sm font-medium leading-relaxed mb-4">
                "단기 알바였음에도 불구하고 간식과 음료를 챙겨주셔서 정말 감동받았습니다. 일이 힘들긴 했지만 팀워크가 좋아 즐겁게 마무리할 수 있었습니다."
              </p>
              <div className="flex justify-end pt-2 border-t border-outline/50">
                <button className="text-primary font-bold text-[11px] flex items-center gap-1 hover:underline">
                  답글 달기 <span className="material-symbols-outlined text-xs">reply</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <nav className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-outline text-on-surface-variant text-xs font-medium transition-all">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-outline text-on-surface-variant text-xs font-medium transition-all">3</button>
              <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant text-xs">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-outline text-on-surface-variant transition-all">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </nav>
          </div>
        </>
      )}

      {/* 내가 쓴 리뷰 탭 */}
      {reviewTab === 'written' && (
        <>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-on-surface">작성한 리뷰 (8)</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-white border border-outline text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">최신순</button>
                <button className="px-3 py-1 bg-white border border-outline text-xs font-medium rounded-lg text-on-surface-variant hover:bg-gray-50 transition-colors">평점순</button>
              </div>
            </div>

            {/* 작성한 리뷰 카드 1 */}
            <div className="bg-white border border-outline rounded-2xl p-6 border-l-4 border-l-primary hover:border-primary/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-soft border border-outline flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg">business</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">스타벅스 강남대로점</span>
                      <span className="text-[10px] text-on-surface-variant">직원 평가 (2024.05.20)</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-1">직원: 김민준</p>
                  </div>
                </div>
                <div className="flex text-primary">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed mb-4">
                "매우 성실하고 빠른 대응으로 팀의 신뢰를 받고 있습니다. 앞으로도 함께 일하고 싶은 훌륭한 직원입니다."
              </p>
              <div className="flex justify-end pt-2 border-t border-outline/50 gap-3">
                <button className="text-primary font-bold text-[11px] hover:underline">수정</button>
                <button className="text-on-surface-variant font-bold text-[11px] hover:text-red-500 transition-colors">삭제</button>
              </div>
            </div>

            {/* 작성한 리뷰 카드 2 */}
            <div className="bg-white border border-outline rounded-2xl p-6 border-l-4 border-l-gray-200 hover:border-primary/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-outline flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">business</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">CJ대한통운 물류센터</span>
                      <span className="text-[10px] text-on-surface-variant">직원 평가 (2024.04.15)</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-1">직원: 박현우</p>
                  </div>
                </div>
                <div className="flex text-primary">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-xs">star</span>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed mb-4">
                "체력이 뛰어나고 책임감이 있습니다. 다만 의사소통 면에서 더 개선되면 좋겠습니다."
              </p>
              <div className="flex justify-end pt-2 border-t border-outline/50 gap-3">
                <button className="text-primary font-bold text-[11px] hover:underline">수정</button>
                <button className="text-on-surface-variant font-bold text-[11px] hover:text-red-500 transition-colors">삭제</button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <nav className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-outline text-on-surface-variant text-xs font-medium transition-all">2</button>
              <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant text-xs">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-outline text-on-surface-variant transition-all">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

function WorkTab() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-black mb-1">근무 관리</h1>
        <p className="text-sm text-on-surface-variant">현재 근무 중인 스태프의 출퇴근 현황과 상세 정보를 실시간으로 확인하세요.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-outline rounded-2xl p-6">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">현재 근무 인원</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-primary">08</span>
            <span className="text-sm font-medium text-on-surface-variant">명</span>
          </div>
        </div>
        <div className="bg-white border border-outline rounded-2xl p-6">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 text-primary">지각 발생</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-primary">01</span>
            <span className="text-sm font-medium text-on-surface-variant">명</span>
          </div>
        </div>
        <div className="bg-white border border-outline rounded-2xl p-6">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">총 근무 시간</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black">64</span>
            <span className="text-sm font-medium text-on-surface-variant">h</span>
          </div>
        </div>
        <div className="bg-white border border-outline rounded-2xl p-6">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">일일 인건비</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black">824K</span>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">실시간 근무자 목록</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-outline text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">filter_list</span> 필터
            </button>
            <button className="px-3 py-1.5 bg-white border border-outline text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">download</span> 엑셀 저장
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white border-l-4 border-l-primary border-y border-r border-outline rounded-2xl p-5 hover:border-primary/30 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-shrink-0">
                <img
                  alt="Staff Profile"
                  className="w-12 h-12 rounded-xl object-cover grayscale"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXkMJjGuJdAOyOjPMscb75mMfIZvaAoffyOuEVjhe-ckVK2M-Oj89UgT6e_4MIu6hwvDFCwovpMbkrgwHeWwbcnyPd0pcG1uqvPjrQvGTpH3GxjvUtsSuHZWxVZcmONgtgM-3Xy2PhPsEunvoVRyD9PP2JWx_95Ql1Jda5_vrl1k2-E5Ri8JE1GM5mVlYzcuBe8ANJYT-LTrKvPLhwU2WAZOhqLpJbXCMSyxx3YLypOL2TRLMUPAYfWMQqqi_5DmjPuep4ezqs5ag"
                />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full border-2 border-white"></span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold">김민준</h4>
                  <span className="text-[10px] font-bold text-primary bg-primary-soft px-1.5 py-0.5 rounded">지각 15분</span>
                </div>
                <p className="text-xs text-on-surface-variant">강남역 카페 테라스 • 바리스타</p>
              </div>
            </div>
            <div className="flex items-center gap-10 md:gap-14">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">출근 시간</p>
                <p className="text-sm font-black">09:15</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">예정 퇴근</p>
                <p className="text-sm font-black">18:00</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">연락처</p>
                <p className="text-sm font-bold text-primary">010-4822-****</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chat</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">more_vert</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-outline rounded-2xl p-5 hover:border-primary/30 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-shrink-0">
                <img
                  alt="Staff Profile"
                  className="w-12 h-12 rounded-xl object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-nD7znoOOeOaREqQ8C9uuJ7yJekJ63cx7zvA_DqUCD1j9scbLzNU8MmXlikcPtbRwiXdd_1rg4E776ppHnXroW5oTUk88ixYr564gzTziqjGhUTL_tBbfInBZoq_oaSHvaZ0i9Ae2pZpvsU_PY1wy6UWLxYRaxdVPCoQmSRgFAu3hz9RZgxJISGk2V_bFUbkDbcxOVS54ehfjQP4Z6kXrt7wE9hBzx-1bLeCgj96wKSphh6OrIFm4XGi3EM4ipM2LQ2FcWYQZogI"
                />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold">이지은</h4>
                  <span className="text-[10px] font-bold text-on-surface-variant bg-gray-100 px-1.5 py-0.5 rounded">정상 근무</span>
                </div>
                <p className="text-xs text-on-surface-variant">역삼동 피트니스 센터 • 트레이너</p>
              </div>
            </div>
            <div className="flex items-center gap-10 md:gap-14">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">출근 시간</p>
                <p className="text-sm font-black">10:00</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">예정 퇴근</p>
                <p className="text-sm font-black">15:00</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">연락처</p>
                <p className="text-sm font-bold text-primary">010-9281-****</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chat</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">more_vert</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-outline rounded-2xl p-5 hover:border-primary/30 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-shrink-0">
                <img
                  alt="Staff Profile"
                  className="w-12 h-12 rounded-xl object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVKjeV4yqk5nx_DVewydcqgPELJVYgaV6rNYP8b8h3VnwwIXgmXp6uMgC3mevw5SkuEEhiVt6FfqOFLJQCGw138Ege5CN9zDtx0KPrc-wnV_Fn5QT-bWF2MWcedTcrdMluWEAQTyUDjPmOp7q1fI25e2x9J17KY47PL3CC2TRJC-_rK8W5M0iEKjnIt9DS4PNpT9ueLQVxNVT-7idYwXnyGSet8LKtZWmM4QOiT-FVzHk0C54scwO0LDa0YIIpDEwqgQm0JMFv9eE"
                />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold">박현우</h4>
                  <span className="text-[10px] font-bold text-on-surface-variant bg-gray-100 px-1.5 py-0.5 rounded">정상 근무</span>
                </div>
                <p className="text-xs text-on-surface-variant">성수동 팝업스토어 • 현장 관리</p>
              </div>
            </div>
            <div className="flex items-center gap-10 md:gap-14">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">출근 시간</p>
                <p className="text-sm font-black">08:58</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">예정 퇴근</p>
                <p className="text-sm font-black">19:00</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">연락처</p>
                <p className="text-sm font-bold text-primary">010-5532-****</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chat</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">more_vert</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BusinessMyPage;

