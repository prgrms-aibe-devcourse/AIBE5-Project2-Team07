import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import MobileBottomNav from '../components/MobileBottomNav';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import NearbyJobsSection from '../components/NearbyJobsSection';
import RecommendFilterModal from '../components/RecommendFilterModal';
import RecommendJobsSection from '../components/RecommendJobsSection';
import { useNearbyJobs } from '../hooks/useNearbyJobs';
import { fetchRecommendJobs } from '../services/recommendApi';
import { RECOMMEND_DEFAULT_FILTERS } from '../constants/recommendFilterOptions';
import { getStoredMember } from '../services/authApi';

const tabs = [
  { key: 'nearby', label: '거리 기반 추천' },
  { key: 'condition', label: '조건 선택 추천' },
];

export default function AiRecommendPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'nearby';
  const [showRecommendLoginModal, setShowRecommendLoginModal] = useState(false);

  // nearby tab state
  const [selectedDistance, setSelectedDistance] = useState('5km');
  const [isDistanceDropdownOpen, setIsDistanceDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { jobs: nearbyJobs, loading: nearbyLoading, error: nearbyError, fetchJobs } = useNearbyJobs();
  const [nearbyFetched, setNearbyFetched] = useState(false);

  // condition tab state
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [recommendFilters, setRecommendFilters] = useState(RECOMMEND_DEFAULT_FILTERS);
  const [recommendJobs, setRecommendJobs] = useState([]);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState('');
  const [recommendApplied, setRecommendApplied] = useState(false);

  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: 'nearby' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDistanceDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const member = getStoredMember();
    if (!token || !member) {
      setShowRecommendLoginModal(true);
    }
  }, []);

  const setTab = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  function handleDistanceSelect(distance) {
    const radiusKm = Number.parseFloat(distance.replace('km', ''));
    setSelectedDistance(distance);
    setIsDistanceDropdownOpen(false);
    setNearbyFetched(true);
    fetchJobs(radiusKm);
  }

  async function handleApplyRecommendFilters(nextFilters) {
    const requestPayload = {
      regionId: nextFilters.regionId ?? null,
      workPeriod: nextFilters.workPeriod ?? [],
      workDays: nextFilters.workDays ?? [],
      workTime: nextFilters.workTime ?? [],
      businessType: nextFilters.businessType ?? [],
      salaryType: nextFilters.salaryType ?? null,
      urgent: Boolean(nextFilters.urgent),
      resultCount: nextFilters.resultCount ?? 20,
    };
    setRecommendFilters(nextFilters);
    setIsRecommendModalOpen(false);
    setRecommendApplied(true);
    setRecommendLoading(true);
    setRecommendError('');
    setRecommendJobs([]);
    try {
      const data = await fetchRecommendJobs(requestPayload);
      setRecommendJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      setRecommendError(error.message || '맞춤형 추천 공고를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setRecommendLoading(false);
    }
  }

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
              : '내 위치를 기반으로 가까운 알바 공고를 찾아드립니다.'}
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

        {/* 거리 기반 추천 탭 */}
        <section className={currentTab === 'nearby' ? 'block' : 'hidden'}>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">내 주변 공고</h2>
            <div className="flex flex-wrap gap-3">
              {['1km', '3km', '5km', '10km'].map((distance) => (
                <button
                  key={distance}
                  onClick={() => handleDistanceSelect(distance)}
                  className={`rounded-full px-6 py-2.5 text-sm font-bold whitespace-nowrap transition-colors shadow-sm ${
                    selectedDistance === distance && nearbyFetched
                      ? 'bg-primary text-white'
                      : 'border border-[#e0e0e0] bg-white text-[#555555] hover:bg-gray-50'
                  }`}
                >
                  {distance}
                </button>
              ))}
            </div>
          </div>

          {!nearbyFetched ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl text-primary/40">near_me</span>
              <p className="text-base font-bold text-on-surface">거리를 선택하면 주변 공고를 찾아드립니다.</p>
              <p className="text-sm text-on-surface-variant">위의 거리 버튼을 눌러 내 주변 공고를 검색해 보세요.</p>
            </div>
          ) : (
            <NearbyJobsSection
              jobs={nearbyJobs}
              loading={nearbyLoading}
              error={nearbyError}
              selectedDistance={selectedDistance}
            />
          )}
        </section>

        {/* 조건 선택 추천 탭 */}
        <section className={currentTab === 'condition' ? 'block' : 'hidden'}>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-on-surface mb-1">맞춤형 추천</h2>
              <p className="text-sm text-on-surface-variant">조건을 설정하면 맞는 공고를 추천해드립니다.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsRecommendModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-primary text-white px-6 py-3 text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              추천 조건 설정하기
            </button>
          </div>

          {!recommendApplied ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl text-primary/40">auto_awesome</span>
              <p className="text-base font-bold text-on-surface">아직 조건이 설정되지 않았습니다.</p>
              <p className="text-sm text-on-surface-variant">위의 "추천 조건 설정하기" 버튼을 눌러 맞춤 공고를 찾아보세요.</p>
              <button
                type="button"
                onClick={() => setIsRecommendModalOpen(true)}
                className="mt-2 rounded-full bg-primary text-white px-8 py-3 text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors"
              >
                조건 설정하기
              </button>
            </div>
          ) : (
            <RecommendJobsSection
              jobs={recommendJobs}
              loading={recommendLoading}
              error={recommendError}
              filters={recommendFilters}
            />
          )}
        </section>
      </main>

      <AppFooter />
      <MobileBottomNav />

      <RecommendFilterModal
        isOpen={isRecommendModalOpen}
        initialFilters={recommendFilters}
        onClose={() => setIsRecommendModalOpen(false)}
        onApply={handleApplyRecommendFilters}
      />

      <div className={`${showRecommendLoginModal ? '' : 'hidden'} fixed inset-0 z-[100] flex items-center justify-center p-6`}>
        <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"></div>
        <div className="relative bg-white w-full max-w-md p-10 rounded-2xl flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>lock</span>
          </div>
          <h5 className="text-2xl font-bold mb-3">추천 매칭은 개인 회원 전용입니다</h5>
          <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">
            개인 회원 로그인 후 추천 매칭 기능을 이용할 수 있습니다.<br />
            로그인 후 내 주변/맞춤형 공고를 확인해 보세요.
          </p>
          <div className="w-full flex flex-col gap-3">
            <CommonButton size="full" onClick={() => navigate('/login')}>
              개인 회원 로그인
            </CommonButton>
            <CommonButton variant="subtle" size="full" onClick={() => setShowRecommendLoginModal(false)}>
              닫기
            </CommonButton>
          </div>
        </div>
      </div>
    </>
  );
}

