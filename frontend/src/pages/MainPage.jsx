import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { addRecruitScrap, getMyScrapRecruitIds, removeRecruitScrap } from '../services/scrapRecruitApi';

const getToken = () => localStorage.getItem('token');

const API_PREFIXES = ['/api', ''];

const BUSINESS_LABELS = {
  FOOD_RESTAURANT: '외식',
  CAFE: '카페',
  RETAIL_STORE: '매장관리/판매',
  SERVICE: '서비스',
  DELIVERY_DRIVER: '운전/배달',
  MANUAL_LABOR: '현장단순노무',
};

async function fetchJsonWithFallback(path) {
  let lastError = null;
  for (const prefix of API_PREFIXES) {
    try {
      const response = await fetch(`${prefix}${path}`);
      if (response.ok) return response.json();
      if (response.status === 404) continue;
      const errorText = await response.text();
      throw new Error(errorText || `요청 실패 (${response.status})`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('메인 공고 데이터를 불러오지 못했습니다.');
}

function normalizeRecruitStatus(status) { return String(status || '').toUpperCase(); }
function isExpiredRecruit(status) { return normalizeRecruitStatus(status) === 'EXPIRED'; }
function formatSalaryAmount(salary) {
  if (salary == null) return '-';
  return `${Number(salary).toLocaleString('ko-KR')}원`;
}
function formatBusinessType(values) {
  if (!Array.isArray(values) || values.length === 0) return '-';
  return values.map((v) => BUSINESS_LABELS[v] || v).join(', ');
}
function formatDate(dateText) {
  if (!dateText) return '-';
  const date = new Date(dateText);
  return Number.isNaN(date.getTime()) ? dateText : date.toLocaleDateString('ko-KR');
}
function formatRelativeTime(dateText) {
  if (!dateText) return '-';
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return dateText;
  const diffMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 60) return `${diffMinutes || 1}분 전`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  return `${Math.floor(diffHours / 24)}일 전`;
}
function getDday(deadline) {
  if (!deadline) return '-';
  const target = new Date(deadline);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff < 0 ? '마감' : `D-${diff}`;
}
function formatWorkDateLabel(deadline) {
  const formatted = formatDate(deadline);
  return formatted === '-' ? '-' : `근무일 ${formatted}`;
}

export default function MainPage() {
  // ── 모든 Hook은 함수 정의보다 먼저 ──────────────────────────────
  // 근거리/추천 필터 상태
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

  // 실제 API 데이터 / 스크랩 상태
  const [urgentJobs, setUrgentJobs] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [scrappedRecruitIds, setScrappedRecruitIds] = useState([]);
  const [scrapLoadingIds, setScrapLoadingIds] = useState([]);
  const [scrapError, setScrapError] = useState('');
  const [showScrapLoginModal, setShowScrapLoginModal] = useState(false);
  const [showScrapBusinessModal, setShowScrapBusinessModal] = useState(false);

  const navigate = useNavigate();
  const { jobs: nearbyJobs, loading: nearbyLoading, error: nearbyError, fetchJobs } = useNearbyJobs();

  const urgentRecruitLink = '/recruit-information?tab=ALL&sort=LATEST&isUrgent=true';
  const latestRecruitLink = '/recruit-information?tab=ALL&sort=LATEST';

  const urgentCards = useMemo(() => urgentJobs.map((job) => ({
    id: job.id,
    companyName: job.companyName || '-',
    title: job.title || '-',
    regionName: job.regionName || '-',
    workDateLabel: formatWorkDateLabel(job.deadline),
    ddayLabel: getDday(job.deadline),
    salary: formatSalaryAmount(job.salary),
  })), [urgentJobs]);

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
    const loadMainRecruitData = async () => {
      try {
        setLoading(true);
        setLoadError('');

        const [urgentResult, latestResult] = await Promise.all([
          fetchJsonWithFallback('/recruits?type=ALL&page=1&size=4&sort=LATEST&isUrgent=true&urgent=true&is_urgent=true'),
          fetchJsonWithFallback('/recruits?type=ALL&page=1&size=4&sort=LATEST'),
        ]);

        const urgentContent = (Array.isArray(urgentResult?.content) ? urgentResult.content : [])
          .filter((item) => !isExpiredRecruit(item?.status))
          .filter((item) => Boolean(item?.isUrgent ?? item?.urgent))
          .slice(0, 4);

        const latestContent = (Array.isArray(latestResult?.content) ? latestResult.content : [])
          .filter((item) => !isExpiredRecruit(item?.status))
          .slice(0, 4);

        setUrgentJobs(urgentContent);
        setLatestJobs(latestContent);
      } catch (error) {
        setLoadError(error.message || '메인 공고를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadMainRecruitData();
  }, []);

  useEffect(() => {
    const loadScrapIds = async () => {
      const token = getToken();
      const member = getStoredMember();

      if (!token || !member || member.memberType !== 'INDIVIDUAL') {
        setScrappedRecruitIds([]);
        return;
      }

      try {
        const ids = await getMyScrapRecruitIds(member.id);
        setScrappedRecruitIds(ids);
      } catch {
        setScrappedRecruitIds([]);
      }
    };

    loadScrapIds();
  }, []);

  // ── 이벤트 핸들러 (Hook 아님) ──────────────────────────────────
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

  const moveToRecruitDetail = (recruitId) => {
    navigate(`/recruit-detail?recruitId=${recruitId}`);
  };

  const handleRecruitCardKeyDown = (event, recruitId) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    moveToRecruitDetail(recruitId);
  };

  const isRecruitScrapped = (recruitId) => scrappedRecruitIds.includes(Number(recruitId));
  const isRecruitScrapLoading = (recruitId) => scrapLoadingIds.includes(Number(recruitId));

  const handleScrapClick = async (event, recruitId) => {
    event.preventDefault();
    event.stopPropagation();

    const token = getToken();
    const member = getStoredMember();

    if (!token || !member) {
      setShowScrapLoginModal(true);
      return;
    }

    if (member.memberType !== 'INDIVIDUAL') {
      setShowScrapBusinessModal(true);
      return;
    }

    const numericRecruitId = Number(recruitId);

    try {
      setScrapError('');
      setScrapLoadingIds((prev) => (prev.includes(numericRecruitId) ? prev : [...prev, numericRecruitId]));

      if (isRecruitScrapped(numericRecruitId)) {
        await removeRecruitScrap(member.id, numericRecruitId);
        setScrappedRecruitIds((prev) => prev.filter((id) => id !== numericRecruitId));
      } else {
        await addRecruitScrap(member.id, numericRecruitId);
        setScrappedRecruitIds((prev) => [...prev, numericRecruitId]);
      }
    } catch (error) {
      setScrapError(error.message || '공고 스크랩 중 오류가 발생했습니다.');
    } finally {
      setScrapLoadingIds((prev) => prev.filter((id) => id !== numericRecruitId));
    }
  };



  return (
    <>
      <TopNavBar />
      <main className="pt-20">
        <section className="bg-white pt-8 pb-12">
          <div className="custom-container">
            <div className="hero-gradient rounded-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between p-10 md:p-12 relative min-h-[320px]">

              {/* 이미지: 전체 꽉 채우기 */}
              <img
                alt="Professional workspace"
                className="absolute inset-0 w-full h-full object-cover"
                src="https://i.imgur.com/4VtnSNA.png"
              />

              {/* 그라디언트: 왼쪽 진하게 → 오른쪽 투명 */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, #1A1818 30%, rgba(26,24,24,0.7) 50%, transparent 100%)"
                }}
              />

              {/* 텍스트 컨텐츠 */}
              <div className="z-10 text-center md:text-left space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-1.5 rounded-full text-primary font-bold text-xs border border-primary/30 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: '"FILL" 1' }}>emergency</span>
                  긴급 매칭
                </div>
                <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight text-white md:text-4xl">
                  알바 펑크 났어? 대타 불러!
                </h1>
                <p className="text-base font-medium text-white/60">
                  평균 매칭 시간 15분. 지각 없는 검증된 인재를 바로 연결해드립니다.
                </p>
                <CommonButton className="mt-2" size="lg" to={urgentRecruitLink}>
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
              <Link to={urgentRecruitLink} className="text-primary font-bold flex items-center gap-1 group py-2">
                더보기 <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
              </Link>
            </div>
            {loading && <p className="text-on-surface-variant py-10">급구 공고를 불러오는 중입니다...</p>}
            {!loading && loadError && <p className="text-red-600 py-10">{loadError}</p>}
            {!loading && !loadError && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {urgentCards.map((job) => (
                  <div
                    key={job.id}
                    className="bg-primary-soft rounded-xl p-7 flex flex-col justify-between min-h-[240px] transition-all shadow-md shadow-primary/5 hover:shadow-xl hover:-translate-y-1 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
                    role="link"
                    tabIndex={0}
                    onClick={() => moveToRecruitDetail(job.id)}
                    onKeyDown={(event) => handleRecruitCardKeyDown(event, job.id)}
                  >
                    <div className="relative z-20">
                      <span className="text-primary font-bold text-xs block mb-1">{job.companyName}</span>
                      <h3 className="text-lg font-bold leading-snug mb-3 flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-[15px]" style={{ fontVariationSettings: '"FILL" 1' }}>emergency</span>
                        <span>  </span>{job.title}
                      </h3>
                      <div className="flex gap-2 text-on-surface-variant text-[11px] font-semibold">
                        <span>{job.regionName}</span>
                        <span>•</span>
                        <span>{job.workDateLabel}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-4 relative z-20">
                      <span className="text-xl font-black text-primary">{job.salary}<small className="text-[10px] font-bold text-on-surface ml-1">/시간</small></span>
                      <button
                        type="button"
                        onClick={(event) => handleScrapClick(event, job.id)}
                        disabled={isRecruitScrapLoading(job.id)}
                        className={`material-symbols-outlined transition-colors ${isRecruitScrapped(job.id) ? 'text-primary' : 'text-on-surface-variant/40 hover:text-primary'} ${isRecruitScrapLoading(job.id) ? 'opacity-50' : ''}`}
                        style={{ fontVariationSettings: isRecruitScrapped(job.id) ? '"FILL" 1' : '"FILL" 0' }}
                        aria-label="공고 스크랩"
                      >
                        bookmark
                      </button>
                    </div>
                  </div>
                ))}
                {urgentCards.length === 0 && (
                  <div className="col-span-full text-center text-on-surface-variant py-12">현재 표시할 급구 공고가 없습니다.</div>
                )}
              </div>
            )}
            {scrapError && <p className="text-red-600 text-sm mt-6">{scrapError}</p>}
          </div>
        </section>

        <section className="bg-[#f9f9f9] py-10">
          <div className="custom-container">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tighter">AI 추천 공고</h2>
                <p className="mt-2 font-medium text-on-surface-variant">내 경력과 위치를 기반으로 한 맞춤형 일자리</p>
              </div>
              <Link to="/ai-recommend" className="text-primary font-bold flex items-center gap-1 group py-2">
                더보기 <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 flex flex-col justify-between min-h-[260px] relative transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
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

              <div className="bg-white rounded-xl p-8 flex flex-col justify-between min-h-[260px] transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
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

              <div className="bg-white rounded-xl p-8 flex flex-col justify-between min-h-[260px] transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
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

                {loading && <p className="py-8 text-on-surface-variant">전체 공고를 불러오는 중입니다...</p>}
                {!loading && loadError && <p className="py-8 text-red-600">{loadError}</p>}
                {!loading && !loadError && latestJobs.map((job) => (
                  <div
                    key={job.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-6 border-b border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors items-center relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
                    role="link"
                    tabIndex={0}
                    onClick={() => moveToRecruitDetail(job.id)}
                    onKeyDown={(event) => handleRecruitCardKeyDown(event, job.id)}
                  >
                    <div className="col-span-1 lg:col-span-5">
                      <p className={`text-[11px] font-bold mb-0.5 ${(job.isUrgent ?? job.urgent) ? 'text-primary' : ''}`}>{job.companyName || '-'}</p>
                      <h4 className="text-base font-bold flex items-center gap-1.5">
                        {(job.isUrgent ?? job.urgent) && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-primary mr-1"><span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>emergency</span></span>
                        )}
                        {job.title || '-'}
                      </h4>
                    </div>
                    <div className="col-span-1 lg:col-span-2 flex items-center text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm mr-1 lg:hidden">location_on</span> {job.regionName || '-'}
                    </div>
                    <div className="col-span-1 lg:col-span-2 flex items-center text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm mr-1 lg:hidden">category</span> {formatBusinessType(job.businessType)}
                    </div>
                    <div className="col-span-1 lg:col-span-2 text-left lg:text-right">
                      <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:gap-0">
                        <span className={`text-lg font-black ${(job.isUrgent ?? job.urgent) ? 'text-primary' : 'text-on-surface'}`}>{formatSalaryAmount(job.salary)}</span>
                        <span className={`text-[11px] ${(job.isUrgent ?? job.urgent) ? 'font-bold text-primary' : 'text-stone-400'}`}>{getDday(job.deadline)}</span>
                      </div>
                    </div>
                    <div className="col-span-1 lg:col-span-1 flex justify-between lg:justify-end items-center">
                      <span className="text-[11px] font-medium text-on-surface-variant">{formatRelativeTime(job.createdAt)}</span>
                      <button
                        type="button"
                        onClick={(event) => handleScrapClick(event, job.id)}
                        disabled={isRecruitScrapLoading(job.id)}
                        className={`material-symbols-outlined transition-colors lg:hidden ${isRecruitScrapped(job.id) ? 'text-primary' : 'text-on-surface-variant/40 hover:text-primary'} ${isRecruitScrapLoading(job.id) ? 'opacity-50' : ''}`}
                        style={{ fontVariationSettings: isRecruitScrapped(job.id) ? '"FILL" 1' : '"FILL" 0' }}
                        aria-label="공고 스크랩"
                      >
                        bookmark
                      </button>
                    </div>
                  </div>
                ))}

                {!loading && !loadError && latestJobs.length === 0 && (
                  <div className="px-8 py-16 text-center text-on-surface-variant border-b border-[#e8e8e8]">표시할 최신 공고가 없습니다.</div>
                )}

                <div className="mt-16 flex justify-center">
                  <CommonButton
                    to={latestRecruitLink}
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

      <div className={`${showScrapLoginModal ? '' : 'hidden'} fixed inset-0 z-[100] flex items-center justify-center p-6`}>
        <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setShowScrapLoginModal(false)}></div>
        <div className="relative bg-white w-full max-w-md p-10 rounded-2xl flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>lock</span>
          </div>
          <h5 className="text-2xl font-bold mb-3">개인 회원 전용 메뉴입니다</h5>
          <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">
            공고 스크랩은 개인 회원 로그인 후 이용하실 수 있습니다.<br />
            로그인 후 원하는 공고를 저장해 보세요!
          </p>
          <div className="w-full flex flex-col gap-3">
            <CommonButton size="full" to="/login" onClick={() => setShowScrapLoginModal(false)}>
              개인 회원 로그인
            </CommonButton>
            <CommonButton variant="subtle" size="full" to="/signup/personal" onClick={() => setShowScrapLoginModal(false)}>
              개인 회원 가입하기
            </CommonButton>
          </div>
          <button className="mt-6 text-on-surface-variant text-sm font-bold underline decoration-outline underline-offset-4" onClick={() => setShowScrapLoginModal(false)}>
            닫기
          </button>
        </div>
      </div>

      <div className={`${showScrapBusinessModal ? '' : 'hidden'} fixed inset-0 z-[100] flex items-center justify-center p-6`}>
        <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setShowScrapBusinessModal(false)}></div>
        <div className="relative bg-white w-full max-w-md p-10 rounded-2xl flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>business_center</span>
          </div>
          <h5 className="text-2xl font-bold mb-3">사업자 회원은 공고를 스크랩할 수 없습니다</h5>
          <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">
            공고 스크랩은 개인회원 전용 기능입니다.<br />
            개인회원 계정으로 로그인한 뒤 이용해 주세요.
          </p>
          <CommonButton size="full" onClick={() => setShowScrapBusinessModal(false)}>
            확인
          </CommonButton>
        </div>
      </div>
    </>
  );
}
