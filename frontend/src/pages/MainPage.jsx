import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function MainPage() {
  const [selectedDistance, setSelectedDistance] = useState('5km');
  const [isDistanceDropdownOpen, setIsDistanceDropdownOpen] = useState(false);
  const [isNearbyMode, setIsNearbyMode] = useState(false);
  const [isRecommendMode, setIsRecommendMode] = useState(false);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [recommendFilters, setRecommendFilters] = useState(RECOMMEND_DEFAULT_FILTERS);
  const [recommendJobs, setRecommendJobs] = useState([]);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState('');
  const dropdownRef = useRef(null);

  const {
    jobs: nearbyJobs,
    loading: nearbyLoading,
    error: nearbyError,
    fetchJobs,
  } = useNearbyJobs();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDistanceDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleDistanceSelect(distance) {
    const radiusKm = Number.parseFloat(distance.replace('km', ''));
    setSelectedDistance(distance);
    setIsDistanceDropdownOpen(false);
    setIsNearbyMode(true);
    setIsRecommendMode(false);
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
    setIsNearbyMode(false);
    setIsRecommendMode(true);
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

  function resetToAllJobs() {
    setIsNearbyMode(false);
    setIsRecommendMode(false);
    setIsDistanceDropdownOpen(false);
  }

  return (
    <>
      <TopNavBar />
      <main className="pt-20">
        <section className="bg-white pt-8 pb-12">
          <div className="custom-container">
            <div className="hero-gradient relative flex min-h-[320px] flex-col items-center justify-between overflow-hidden rounded-2xl p-10 md:flex-row md:p-12">
              <div className="z-10 max-w-xl space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur-sm">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>
                    notifications_active
                  </span>
                  긴급 매칭
                </div>
                <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight text-white md:text-4xl">
                  알바 펑크 났어? 대타 불러!
                </h1>
                <p className="text-base font-medium text-white/60">
                  평균 매칭 시간 15분. 지각 없는 검증된 인재를 바로 연결해드립니다.
                </p>
                <CommonButton className="mt-2" size="lg">
                  전체 급구 공고 보기
                </CommonButton>
              </div>
              <div className="absolute right-0 top-0 bottom-0 hidden w-3/5 md:block">
                <img
                  alt="Professional workspace"
                  className="h-full w-full object-cover opacity-40 mix-blend-luminosity"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTW1fdO6U3QwEHuPCuBshMpupR90GUtEDzRMsbW-yPRBz6VWTwmHT1cJZFSA4N8aQP02aoTIjMyE7ZGHFs3FZWBha6gF1mpkQ5fD4txI0eL7kDKjBvcM7U5l9rQqCw3MaiGf40d9_esIvI7YIoMbWmmZQykSB7bvLg8N36PCgxAfvjSYFmUj4Imz7Y8q6kCsQXAvT5dCrgZo41c-0U2LC4WOch0mGDZJpdp-c_0d4lR4pFpCij9EfP0liTpG_ccQwrxr0nz-zQ8DI"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1818] via-[#1A1818]/60 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-10">
          <div className="custom-container">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tighter">급구 공고</h2>
                <p className="mt-2 font-medium text-on-surface-variant">지금 바로 지원 가능한 긴급 구인 건입니다.</p>
              </div>
              <Link to="/ai-recommend" className="group flex items-center gap-1 py-2 font-bold text-primary">
                더보기
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative flex min-h-[240px] flex-col justify-between rounded-xl bg-primary-soft p-7 shadow-md shadow-primary/5 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div>
                  <span className="mb-1 block text-xs font-bold text-primary">삼성동 마이카페</span>
                  <h3 className="mb-3 flex items-center gap-1 text-lg font-bold leading-snug">
                    <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
                      notifications_active
                    </span>
                    홀 서빙 및 결제 관리 (즉시 투입)
                  </h3>
                  <div className="flex gap-2 text-[11px] font-semibold text-on-surface-variant">
                    <span>서울 강남구</span>
                    <span>•</span>
                    <span>지금 시작</span>
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <span className="text-xl font-black text-primary">
                    16,000원
                    <small className="ml-1 text-[10px] font-bold text-on-surface">/시간</small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 transition-colors hover:text-primary">bookmark</button>
                </div>
                <Link to="/recruit-detail" className="absolute inset-0 z-10" />
              </div>

              <div className="relative flex min-h-[240px] flex-col justify-between rounded-xl bg-primary-soft p-7 shadow-md shadow-primary/5 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div>
                  <span className="mb-1 block text-xs font-bold text-primary">판교 정보단지</span>
                  <h3 className="mb-3 flex items-center gap-1 text-lg font-bold leading-snug">
                    <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
                      notifications_active
                    </span>
                    행사 등록 데스크 안내 요원
                  </h3>
                  <div className="flex gap-2 text-[11px] font-semibold text-on-surface-variant">
                    <span>경기 성남시</span>
                    <span>•</span>
                    <span>14:00 시작</span>
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <span className="text-xl font-black text-primary">
                    13,500원
                    <small className="ml-1 text-[10px] font-bold text-on-surface">/시간</small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 transition-colors hover:text-primary">bookmark</button>
                </div>
                <Link to="/recruit-detail" className="absolute inset-0 z-10" />
              </div>

              <div className="relative flex min-h-[240px] flex-col justify-between rounded-xl bg-primary-soft p-7 shadow-md shadow-primary/5 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div>
                  <span className="mb-1 block text-xs font-bold text-primary">더 플랜지</span>
                  <h3 className="mb-3 flex items-center gap-1 text-lg font-bold leading-snug">
                    <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
                      notifications_active
                    </span>
                    주방 설거지 및 뒷정리 보조
                  </h3>
                  <div className="flex gap-2 text-[11px] font-semibold text-on-surface-variant">
                    <span>서울 종로구</span>
                    <span>•</span>
                    <span>18:00 시작</span>
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <span className="text-xl font-black text-primary">
                    15,000원
                    <small className="ml-1 text-[10px] font-bold text-on-surface">/시간</small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 transition-colors hover:text-primary">bookmark</button>
                </div>
                <Link to="/recruit-detail" className="absolute inset-0 z-10" />
              </div>

              <div className="relative flex min-h-[240px] flex-col justify-between rounded-xl bg-primary-soft p-7 shadow-md shadow-primary/5 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div>
                  <span className="mb-1 block text-xs font-bold text-primary">메디 스캔</span>
                  <h3 className="mb-3 flex items-center gap-1 text-lg font-bold leading-snug">
                    <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
                      notifications_active
                    </span>
                    검진 센터 문서 파쇄 단기 알바
                  </h3>
                  <div className="flex gap-2 text-[11px] font-semibold text-on-surface-variant">
                    <span>서울 서초구</span>
                    <span>•</span>
                    <span>즉시 가능</span>
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <span className="text-xl font-black text-primary">
                    12,000원
                    <small className="ml-1 text-[10px] font-bold text-on-surface">/시간</small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 transition-colors hover:text-primary">bookmark</button>
                </div>
                <Link to="/recruit-detail" className="absolute inset-0 z-10" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f9f9f9] py-10">
          <div className="custom-container">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tighter">AI 추천 공고</h2>
                <p className="mt-2 font-medium text-on-surface-variant">내 경력과 위치를 기반으로 한 맞춤형 일자리</p>
              </div>
              <button className="group flex items-center gap-1 py-2 font-bold text-primary">
                더보기
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="relative flex min-h-[260px] flex-col justify-between rounded-xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex flex-col gap-2">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="block text-sm font-bold text-primary">프리미엄 라운지</span>
                    <div className="flex items-center gap-1 rounded-sm bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                        emergency
                      </span>
                      긴급
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold leading-tight">청담동 하이엔드 카페 주말 오후 서빙 스태프</h3>
                  <div className="flex gap-2 text-xs font-semibold text-on-surface-variant">
                    <span>서울 강남구</span>
                    <span>•</span>
                    <span>오늘 14:00 시작</span>
                  </div>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <span className="text-2xl font-black text-primary">
                    15,000원
                    <small className="ml-1 text-xs font-bold text-on-surface">/시간</small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 transition-colors hover:text-primary">bookmark</button>
                </div>
              </div>

              <div className="flex min-h-[260px] flex-col justify-between rounded-xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex flex-col gap-2">
                  <span className="mb-2 block text-sm font-bold text-on-surface-variant">에이치 리테일</span>
                  <h3 className="mb-2 text-xl font-bold leading-tight">강남역 인근 대형 매장 상품 진열 및 재고 관리</h3>
                  <div className="flex gap-2 text-xs font-semibold text-on-surface-variant">
                    <span>서울 서초구</span>
                    <span>•</span>
                    <span>내일부터 시작</span>
                  </div>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <span className="text-2xl font-black text-on-surface">
                    11,500원
                    <small className="ml-1 text-xs font-bold text-on-surface-variant">/시간</small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 transition-colors hover:text-primary">bookmark</button>
                </div>
              </div>

              <div className="flex min-h-[260px] flex-col justify-between rounded-xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex flex-col gap-2">
                  <span className="mb-2 block text-sm font-bold text-on-surface-variant">베이커리 온</span>
                  <h3 className="mb-2 text-xl font-bold leading-tight">가로수길 베이커리 카페 마감 청소 및 포장 파트</h3>
                  <div className="flex gap-2 text-xs font-semibold text-on-surface-variant">
                    <span>서울 강남구</span>
                    <span>•</span>
                    <span>월-금 고정</span>
                  </div>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <span className="text-2xl font-black text-on-surface">
                    10,500원
                    <small className="ml-1 text-xs font-bold text-on-surface-variant">/시간</small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 transition-colors hover:text-primary">bookmark</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-10">
          <div className="custom-container">
            <div className="mb-12">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-extrabold tracking-tighter">전체 공고</h2>
                <div className="flex gap-2 rounded-lg bg-outline/20 p-1">
                  <button className="rounded-md bg-white px-4 py-1.5 text-sm font-bold text-on-surface shadow-sm">최신순</button>
                  <button className="rounded-md px-4 py-1.5 text-sm font-bold text-on-surface-variant transition-colors hover:text-on-surface">시급순</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pb-2">
                <button
                  onClick={resetToAllJobs}
                  className={`rounded-full px-6 py-2.5 text-sm font-bold whitespace-nowrap shadow-sm transition-colors ${
                    !isNearbyMode && !isRecommendMode
                      ? 'bg-primary text-white'
                      : 'border border-[#e0e0e0] bg-white text-[#555555] hover:bg-gray-50'
                  }`}
                >
                  전체
                </button>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDistanceDropdownOpen(!isDistanceDropdownOpen)}
                    className={`flex items-center gap-1 rounded-full px-6 py-2.5 text-sm font-bold whitespace-nowrap transition-colors ${
                      isNearbyMode
                        ? 'bg-primary text-white shadow-sm'
                        : 'border border-[#e0e0e0] bg-white text-[#555555] hover:bg-gray-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">near_me</span>
                    내 주변 {selectedDistance}
                    <span className="material-symbols-outlined text-[16px]">
                      {isDistanceDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                    </span>
                  </button>
                  {isDistanceDropdownOpen ? (
                    <div className="absolute top-full left-1/2 z-50 mt-2 w-full min-w-[120px] -translate-x-1/2 overflow-hidden rounded-xl border border-[#e0e0e0] bg-white shadow-lg">
                      {['1km', '3km', '5km', '10km'].map((distance) => (
                        <button
                          key={distance}
                          onClick={() => handleDistanceSelect(distance)}
                          className={`w-full px-4 py-3 text-center text-sm font-bold transition-colors ${
                            selectedDistance === distance && isNearbyMode
                              ? 'bg-primary/10 text-primary'
                              : 'text-[#555555] hover:bg-gray-50'
                          }`}
                        >
                          {distance}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <button className="rounded-full border border-[#e0e0e0] bg-white px-6 py-2.5 text-sm font-bold whitespace-nowrap text-[#555555] transition-colors hover:bg-gray-50">
                  단기 알바
                </button>
                <button className="rounded-full border border-[#e0e0e0] bg-white px-6 py-2.5 text-sm font-bold whitespace-nowrap text-[#555555] transition-colors hover:bg-gray-50">
                  외국인 가능
                </button>
                <button
                  type="button"
                  onClick={() => setIsRecommendModalOpen(true)}
                  className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold whitespace-nowrap transition-colors ${
                    isRecommendMode
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-[#e0e0e0] bg-white text-[#555555] hover:bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  맞춤형 추천
                </button>
              </div>
            </div>

            {isNearbyMode ? (
              <NearbyJobsSection
                jobs={nearbyJobs}
                loading={nearbyLoading}
                error={nearbyError}
                selectedDistance={selectedDistance}
              />
            ) : isRecommendMode ? (
              <RecommendJobsSection
                jobs={recommendJobs}
                loading={recommendLoading}
                error={recommendError}
                filters={recommendFilters}
              />
            ) : (
              <>
                <div className="hidden grid-cols-12 gap-4 border-b border-[#e8e8e8] px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant lg:grid">
                  <div className="col-span-5">기업 및 공고명</div>
                  <div className="col-span-2">지역</div>
                  <div className="col-span-2">카테고리</div>
                  <div className="col-span-2 text-right">급여 및 마감</div>
                  <div className="col-span-1 text-right">등록</div>
                </div>

                <div className="grid grid-cols-1 gap-4 border-b border-[#e8e8e8] px-6 py-6 transition-colors hover:bg-[#f9f9f9] lg:grid-cols-12 lg:items-center">
                  <div className="col-span-1 lg:col-span-5">
                    <p className="mb-0.5 text-[11px] font-bold text-primary">대치동 입시학원</p>
                    <h4 className="flex items-center gap-1.5 text-base font-bold">
                      <span className="mr-1 flex items-center gap-1 text-[10px] font-bold text-primary">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                          notifications_active
                        </span>
                      </span>
                      보조 강사 급구 (금일 17시)
                    </h4>
                  </div>
                  <div className="col-span-1 flex items-center text-sm text-on-surface-variant lg:col-span-2">
                    <span className="material-symbols-outlined mr-1 text-sm lg:hidden">location_on</span>
                    서울 강남구
                  </div>
                  <div className="col-span-1 flex items-center text-sm text-on-surface-variant lg:col-span-2">
                    <span className="material-symbols-outlined mr-1 text-sm lg:hidden">category</span>
                    교육/학원
                  </div>
                  <div className="col-span-1 text-left lg:col-span-2 lg:text-right">
                    <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-0">
                      <span className="text-lg font-black text-primary">18,000원</span>
                      <span className="text-[11px] font-bold text-primary">D-0</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-between lg:col-span-1 lg:justify-end">
                    <span className="text-[11px] font-medium text-on-surface-variant">15분 전</span>
                    <button className="material-symbols-outlined text-on-surface-variant/40 transition-colors hover:text-primary lg:hidden">bookmark</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 border-b border-[#e8e8e8] px-6 py-6 transition-colors hover:bg-[#f9f9f9] lg:grid-cols-12 lg:items-center">
                  <div className="col-span-1 lg:col-span-5">
                    <p className="mb-0.5 text-[11px] font-bold">성수 팝업</p>
                    <h4 className="text-base font-bold">팝업스토어 안내 데스크 스태프</h4>
                  </div>
                  <div className="col-span-1 flex items-center text-sm text-on-surface-variant lg:col-span-2">
                    <span className="material-symbols-outlined mr-1 text-sm lg:hidden">location_on</span>
                    서울 성동구
                  </div>
                  <div className="col-span-1 flex items-center text-sm text-on-surface-variant lg:col-span-2">
                    <span className="material-symbols-outlined mr-1 text-sm lg:hidden">category</span>
                    전시/행사
                  </div>
                  <div className="col-span-1 text-left lg:col-span-2 lg:text-right">
                    <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-0">
                      <span className="text-lg font-black text-on-surface">11,000원</span>
                      <span className="text-[11px] text-stone-400">D-2</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-between lg:col-span-1 lg:justify-end">
                    <span className="text-[11px] font-medium text-on-surface-variant">1시간 전</span>
                    <button className="material-symbols-outlined text-on-surface-variant/40 transition-colors hover:text-primary lg:hidden">bookmark</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 border-b border-[#e8e8e8] px-6 py-6 transition-colors hover:bg-[#f9f9f9] lg:grid-cols-12 lg:items-center">
                  <div className="col-span-1 lg:col-span-5">
                    <p className="mb-0.5 text-[11px] font-bold text-primary">압구정 테라스</p>
                    <h4 className="flex items-center gap-1.5 text-base font-bold">
                      <span className="mr-1 flex items-center gap-1 text-[10px] font-bold text-primary">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                          notifications_active
                        </span>
                      </span>
                      레스토랑 주방 보조 (내일 고정)
                    </h4>
                  </div>
                  <div className="col-span-1 flex items-center text-sm text-on-surface-variant lg:col-span-2">
                    <span className="material-symbols-outlined mr-1 text-sm lg:hidden">location_on</span>
                    서울 강남구
                  </div>
                  <div className="col-span-1 flex items-center text-sm text-on-surface-variant lg:col-span-2">
                    <span className="material-symbols-outlined mr-1 text-sm lg:hidden">category</span>
                    외식/식음료
                  </div>
                  <div className="col-span-1 text-left lg:col-span-2 lg:text-right">
                    <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-0">
                      <span className="text-lg font-black text-primary">14,500원</span>
                      <span className="text-[11px] font-bold text-primary">D-1</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-between lg:col-span-1 lg:justify-end">
                    <span className="text-[11px] font-medium text-on-surface-variant">3시간 전</span>
                    <button className="material-symbols-outlined text-on-surface-variant/40 transition-colors hover:text-primary lg:hidden">bookmark</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 border-b border-[#e8e8e8] px-6 py-6 transition-colors hover:bg-[#f9f9f9] lg:grid-cols-12 lg:items-center">
                  <div className="col-span-1 lg:col-span-5">
                    <p className="mb-0.5 text-[11px] font-bold">베베 키즈카페</p>
                    <h4 className="text-base font-bold">키즈카페 주말 놀이 보조 선생님</h4>
                  </div>
                  <div className="col-span-1 flex items-center text-sm text-on-surface-variant lg:col-span-2">
                    <span className="material-symbols-outlined mr-1 text-sm lg:hidden">location_on</span>
                    서울 서초구
                  </div>
                  <div className="col-span-1 flex items-center text-sm text-on-surface-variant lg:col-span-2">
                    <span className="material-symbols-outlined mr-1 text-sm lg:hidden">category</span>
                    서비스/기타
                  </div>
                  <div className="col-span-1 text-left lg:col-span-2 lg:text-right">
                    <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-0">
                      <span className="text-lg font-black text-on-surface">12,000원</span>
                      <span className="text-[11px] text-stone-400">D-3</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-between lg:col-span-1 lg:justify-end">
                    <span className="text-[11px] font-medium text-on-surface-variant">4시간 전</span>
                    <button className="material-symbols-outlined text-on-surface-variant/40 transition-colors hover:text-primary lg:hidden">bookmark</button>
                  </div>
                </div>

                <div className="mt-16 flex justify-center">
                  <CommonButton
                    to="/recruit-information"
                    variant="outline"
                    size="xl"
                    icon={<span className="material-symbols-outlined text-lg">add</span>}
                  >
                    더 많은 공고 보기
                  </CommonButton>
                </div>
              </>
            )}
          </div>
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
    </>
  );
}
