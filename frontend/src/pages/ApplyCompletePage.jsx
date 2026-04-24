import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';

function formatApplyNumber(applyId) {
  if (!applyId) {
    return '-';
  }

  return `No. ${String(applyId).padStart(8, '0')}`;
}

function formatDateTime(dateText) {
  if (!dateText) {
    return '-';
  }

  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export default function ApplyCompletePage() {
  const { state } = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-white text-on-surface">
      <TopNavBar />

      <main className="flex-grow flex flex-col items-center px-6 pt-32 pb-20 max-w-4xl mx-auto w-full">
        {/* 성공 메시지 섹션 */}
        <section className="w-full text-center mb-16">
          <div className="mb-10 inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span
                className="material-symbols-outlined text-white text-4xl"
                style={{ fontVariationSettings: '"wght" 700' }}
              >
                check
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
            지원이 완료되었습니다!
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            성공적으로 지원서가 제출되었습니다.<br />
            기업 담당자가 확인 후 연락을 드릴 예정입니다.
          </p>
        </section>

        {/* 지원 요약 카드 */}
        <div className="w-full bg-surface-container rounded-3xl p-8 md:p-10 mb-12 border border-outline">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                  지원 완료
                </span>
                <span className="text-sm text-on-surface-variant font-medium">{formatApplyNumber(state?.applyId)}</span>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2 tracking-tight">
                  {state?.recruitTitle || '지원한 공고'}
                </h2>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-lg">corporate_fare</span>
                  <span className="font-semibold">{state?.companyName || '-'}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:items-end bg-white/50 p-4 rounded-2xl border border-outline/50">
              <span className="text-on-surface-variant text-xs font-medium uppercase tracking-wider mb-1">
                지원 일시
              </span>
              <span className="text-lg font-bold text-on-surface">{formatDateTime(state?.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            to="/personal-mypage?tab=status"
            className="flex-1 max-w-xs inline-flex items-center justify-center gap-2 px-8 py-5 bg-white border-2 border-outline text-on-surface font-bold text-lg rounded-2xl hover:bg-surface-container transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">assignment</span>
            지원 현황 확인
          </Link>
          <Link
            to="/recruit-information"
            className="flex-1 max-w-xs inline-flex items-center justify-center gap-2 px-8 py-5 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-deep transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined">search</span>
            다른 공고 보기
          </Link>
        </div>

        {/* 안내 힌트 */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="bg-surface-container/50 border border-outline p-6 rounded-3xl flex items-center gap-5">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-outline">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                notifications_active
              </span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base">실시간 알림 설정</h3>
              <p className="text-sm text-on-surface-variant leading-tight">
                열람 상태를 알림으로 바로 확인하세요.
              </p>
            </div>
          </div>
          <div className="bg-surface-container/50 border border-outline p-6 rounded-3xl flex items-center gap-5">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-outline">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                bolt
              </span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base">빠른 매칭 팁</h3>
              <p className="text-sm text-on-surface-variant leading-tight">
                프로필 사진 등록 시 성공률 40% UP!
              </p>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
