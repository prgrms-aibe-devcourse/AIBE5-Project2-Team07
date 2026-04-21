import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import MobileBottomNav from '../components/MobileBottomNav';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import KakaoMap from '../components/KakaoMap';

export default function RecruitDetailPage() {
  // 로그인 상태 (실제 서비스에서는 전역 상태/context로 관리)
  const isLoggedIn = false;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (isLoggedIn) {
      navigate('/apply-form');
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <TopNavBar />
      <main className="max-w-4xl mx-auto px-6 py-12 pt-32 pb-40">
        {/* Header: Company & Job Title */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="editorial-line pl-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-primary-soft text-primary px-2 py-0.5 text-xs font-bold rounded">편의점</span>
                <span className="text-on-surface-variant text-sm font-medium">CU 서초중앙점</span>
              </div>
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tighter">
                [긴급] 오늘 야간 편의점 대타 급구 (시급 1.5배)
              </h1>
            </div>
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center shrink-0 border border-outline">
              <img className="w-full h-full object-cover" alt="modern minimalist convenience store logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhVEPcN6NDcVK4hvP5mf8W26F_DCGwCOwqwdaVvPN6uMUW1EooXi6xTd4N4rW5dmzXzwgiWFukHE-WTMc36oRk4bynR17f0iT3dd7G27MjFgfU04V5xazGaEVpgsZ0bl8rcf01I5YN80ryU32KQ5bzPT2ECdu-s74nsn_6ZTpKgOwfHlrETYCEXXi1ptY7LRjqVAFBPvc75UoKet0jgmgZCveYzRrE5lx1SYYladtf-W-yCenBKcxs_GD-XEWM4SDKBI6Th6lN1S4" />
            </div>
          </div>
        </section>
        {/* Content Area */}
        <div className="space-y-16">
          {/* 모집요강 요약 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary">모집요강 요약</h2>
              <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-black">D-0 마감임박</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                <span className="block text-xs text-on-surface-variant mb-1">급여</span>
                <span className="text-xl font-bold text-primary">15,000원</span>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                <span className="block text-xs text-on-surface-variant mb-1">근무기간</span>
                <span className="text-xl font-bold">일일(단기)</span>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                <span className="block text-xs text-on-surface-variant mb-1">근무요일</span>
                <span className="text-xl font-bold">오늘(월)</span>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                <span className="block text-xs text-on-surface-variant mb-1">근무시간</span>
                <span className="text-xl font-bold">22:00 ~ 06:00</span>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                <span className="block text-xs text-on-surface-variant mb-1">고용형태</span>
                <span className="text-xl font-bold">아르바이트</span>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                <span className="block text-xs text-on-surface-variant mb-1">복리후생</span>
                <span className="text-xl font-bold">식비지원</span>
              </div>
            </div>
          </section>
          {/* 상세 모집요강 */}
          <section className="bg-white p-8 rounded-2xl border border-outline">
            <h3 className="font-headline text-2xl font-bold mb-8">상세 모집요강</h3>
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-bold text-on-surface-variant mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">assignment</span> 필수 조건
                </h4>
                <ul className="space-y-2 text-on-surface">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                    <span>근무일시: 2024년 5월 20일 (월) 22:00 ~ 익일 06:00</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                    <span>근무장소: 서울 서초구 반포대로 123 CU 서초중앙점</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                    <span>급여조건: 시급 15,000원 (야간수당 포함, 당일 지급 가능)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                    <span>준비물: 보건증 필참, 단정한 복장</span>
                  </li>
                </ul>
              </div>
              <div className="h-px bg-outline/30"></div>
              <div>
                <h4 className="text-sm font-bold text-on-surface-variant mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">verified_user</span> 자격 요건
                </h4>
                <ul className="space-y-2 text-on-surface">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0"></span>
                    <span>편의점 POS기 조작 가능자 (필수)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0"></span>
                    <span>인근 거주자 및 즉시 출근 가능자 우대</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0"></span>
                    <span>성실하고 책임감 강하신 분</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          {/* 근무지 위치 */}
          <section>
            <h3 className="font-headline text-2xl font-bold mb-6">근무지 위치</h3>
            <div className="bg-surface-container rounded-2xl overflow-hidden relative mb-4 h-[400px] border border-outline">
              <KakaoMap lat={37.5665} lng={126.9780} level={3} />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border border-outline shadow-none">
                <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                서울 서초구 반포대로 123
              </div>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">directions_subway</span>
              <span className="text-sm font-medium">2호선 서초역 3번 출구에서 250m (도보 3분)</span>
            </div>
          </section>
          {/* 근무 후기 */}
          <section className="bg-surface-container-low p-8 rounded-2xl border border-outline">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-xl font-bold">근무 후기</h3>
              <a className="text-primary text-xs font-bold hover:underline" href="#">View More</a>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="text-4xl font-black text-on-surface">4.8</div>
              <div className="flex flex-col">
                <div className="flex text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star_half</span>
                </div>
                <span className="text-xs text-on-surface-variant">최근 12명의 평가</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white px-4 py-2 rounded-full text-xs font-bold border border-outline">#점장님친절해요</span>
              <span className="bg-white px-4 py-2 rounded-full text-xs font-bold border border-outline">#급여정확해요</span>
              <span className="bg-white px-4 py-2 rounded-full text-xs font-bold border border-outline">#업무강도보통</span>
              <span className="bg-white px-4 py-2 rounded-full text-xs font-bold border border-outline">#휴게시간엄수</span>
            </div>
          </section>
          {/* 회사 정보 */}
          <section className="p-8 rounded-2xl bg-white border border-outline">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-3 border border-outline">
                  <img className="w-full h-full object-contain" alt="company logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARFLZUvbVsAeHNcOGTAXqMzXJ0P910nUH5r7q5jGHmKFodPFHVxbOwXEZl59kGOdiqTwAq18fJBSHOjXTYlkZy3wm4EEObZqRIPyMwWCvzficyjRBErPyQu5NydYV_i8YZQIKwS_b-i23cRuRUspr8tkxz-I7gCz_JV5Wn3dKWkRMxlnax8oivFP-UUPOPJbOLk1pOMtlvfiphRXLS98LxFwCy-scHMdonQqbkC_flDIU_a-_1PABzEzA8ZeouW_bF5ht4ZV2fxko" />
                </div>
                <div>
                  <h5 className="font-bold text-lg text-on-surface">CU 서초중앙점</h5>
                  <p className="text-sm text-on-surface-variant">대표: 김영희 | 사업자번호: 123-45-67890</p>
                </div>
              </div>
              <Link
                to="/company-detail"
                className="flex items-center gap-1 text-primary font-bold text-sm hover:underline underline-offset-2 transition-all"
              >
                기업 정보 더보기
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-on-surface-variant">
              <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">location_on</span> 주소: 서울 서초구 반포대로 123 (서초동)</p>
              <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">language</span> 홈페이지: <a className="text-primary hover:underline" href="#">cu.co.kr/seocho</a></p>
            </div>
          </section>
        </div>
      </main>
      {/* Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-outline px-6 py-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="flex items-center gap-6 shrink-0">
            <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">bookmark</span>
              <span className="text-[10px] font-bold">스크랩</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">share</span>
              <span className="text-[10px] font-bold">공유</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">chat</span>
              <span className="text-[10px] font-bold">채팅</span>
            </button>
          </div>
          <div className="h-10 w-px bg-outline/30 mx-2 hidden md:block"></div>
          <div className="flex-1 flex gap-3">
            <CommonButton variant="subtle" size="full" className="flex-1 rounded-xl bg-surface-container hover:bg-surface-variant">
              이메일 지원
            </CommonButton>
            <CommonButton
              onClick={handleApplyClick}
              className="flex-[2] w-auto px-6 py-4 rounded-xl"
            >
              온라인 지원하기
            </CommonButton>
          </div>
        </div>
      </div>
      <AppFooter />
      <MobileBottomNav />

      {/* 개인 회원 로그인 모달 */}
      <div className={`${showLoginModal ? '' : 'hidden'} fixed inset-0 z-[100] flex items-center justify-center p-6`}>
        <div
          className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          onClick={() => setShowLoginModal(false)}
        ></div>
        <div className="relative bg-white w-full max-w-md p-10 rounded-2xl flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mb-6">
            <span
              className="material-symbols-outlined text-primary text-4xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              lock
            </span>
          </div>
          <h5 className="text-2xl font-bold mb-3">개인 회원 전용 메뉴입니다</h5>
          <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">
            온라인 지원은 개인 회원 로그인 후 이용하실 수 있습니다.<br />
            로그인 후 간편하게 지원해 보세요!
          </p>
          <div className="w-full flex flex-col gap-3">
            <CommonButton size="full" onClick={() => setShowLoginModal(false)}>
              개인 회원 로그인
            </CommonButton>
            <CommonButton variant="subtle" size="full" onClick={() => setShowLoginModal(false)}>
              개인 회원 가입하기
            </CommonButton>
          </div>
          <button
            className="mt-6 text-on-surface-variant text-sm font-bold underline decoration-outline underline-offset-4"
            onClick={() => setShowLoginModal(false)}
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}
