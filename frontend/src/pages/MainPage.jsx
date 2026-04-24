import React, { useEffect, useMemo, useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import MobileBottomNav from '../components/MobileBottomNav';
import { Link, useNavigate } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import { getStoredMember } from '../services/authApi';
const getToken = () => localStorage.getItem('token');
import { addRecruitScrap, getMyScrapRecruitIds, removeRecruitScrap } from '../services/scrapRecruitApi';

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
      if (response.ok) {
        return response.json();
      }
      if (response.status === 404) {
        continue;
      }
      const errorText = await response.text();
      throw new Error(errorText || `요청 실패 (${response.status})`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('메인 공고 데이터를 불러오지 못했습니다.');
}

function normalizeRecruitStatus(status) {
  return String(status || '').toUpperCase();
}

function isExpiredRecruit(status) {
  return normalizeRecruitStatus(status) === 'EXPIRED';
}

function formatSalaryAmount(salary) {
  if (salary == null) {
    return '-';
  }
  return `${Number(salary).toLocaleString('ko-KR')}원`;
}

function formatBusinessType(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return '-';
  }
  return values.map((value) => BUSINESS_LABELS[value] || value).join(', ');
}

function formatDate(dateText) {
  if (!dateText) {
    return '-';
  }

  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }

  return date.toLocaleDateString('ko-KR');
}

function formatRelativeTime(dateText) {
  if (!dateText) {
    return '-';
  }

  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 60) {
    return `${diffMinutes || 1}분 전`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }
  return `${Math.floor(diffHours / 24)}일 전`;
}

function getDday(deadline) {
  if (!deadline) {
    return '-';
  }

  const target = new Date(deadline);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) {
    return '마감';
  }
  return `D-${diff}`;
}

function formatWorkDateLabel(deadline) {
  const formatted = formatDate(deadline);
  return formatted === '-' ? '-' : `근무일 ${formatted}`;
}

export default function MainPage() {
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

  const moveToRecruitDetail = (recruitId) => {
    navigate(`/recruit-detail?recruitId=${recruitId}`);
  };

  const handleRecruitCardKeyDown = (event, recruitId) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

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
        {/* Hero Banner Section */}
        <section className="pt-8 pb-12 bg-white">
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
                <h1 className="text-white text-3xl md:text-4xl font-extrabold leading-[1.2] tracking-tight">알바 펑크 났어? 대타 불러!</h1>
                <p className="text-white/60 text-base font-medium">
                  평균 매칭 시간 15분. 지각 없는 검증된 인재를 바로 연결해드립니다.
                </p>
                <CommonButton className="mt-2" size="lg" to={urgentRecruitLink}>
                  전체 급구 공고 보기
                </CommonButton>
              </div>

            </div>
          </div>
        </section>

        {/* Urgent Job Ads Section */}
        <section className="bg-white py-10">
          <div className="custom-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tighter">급구 공고</h2>
                <p className="text-on-surface-variant font-medium mt-2">지금 바로 지원 가능한 긴급 구인 건입니다.</p>
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

        {/* AI Recommendation Section */}
        <section className="bg-[#f9f9f9] py-10">
          <div className="custom-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tighter">AI 추천 공고</h2>
                <p className="text-on-surface-variant font-medium mt-2">내 경력과 위치를 기반으로 한 맞춤형 일자리</p>
              </div>
              <Link to="/ai-recommend" className="text-primary font-bold flex items-center gap-1 group py-2">
                더보기 <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 flex flex-col justify-between min-h-[260px] relative transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-bold text-sm block">프리미엄 라운지</span>
                    <div className="bg-primary text-white px-2 py-0.5 rounded-sm text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: '"FILL" 1' }}>emergency</span>
                      긴급
                    </div>
                  </div>
                  <h3 className="text-xl font-bold leading-tight mb-2">청담동 하이엔드 카페 주말 오후 서빙 스태프</h3>
                  <div className="flex gap-2 text-on-surface-variant text-xs font-semibold">
                    <span>서울 강남구</span>
                    <span>•</span>
                    <span>오늘 14:00 시작</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-6">
                  <span className="text-2xl font-black text-primary">15,000원<small className="text-xs font-bold text-on-surface ml-1">/시간</small></span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors">bookmark</button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 flex flex-col justify-between min-h-[260px] transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                <div className="flex flex-col gap-2">
                  <span className="text-on-surface-variant font-bold text-sm block mb-2">에이치 리테일</span>
                  <h3 className="text-xl font-bold leading-tight mb-2">강남역 인근 대형 매장 상품 진열 및 재고 관리</h3>
                  <div className="flex gap-2 text-on-surface-variant text-xs font-semibold">
                    <span>서울 서초구</span>
                    <span>•</span>
                    <span>내일부터 시작</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-6">
                  <span className="text-2xl font-black text-on-surface">11,500원<small className="text-xs font-bold text-on-surface-variant ml-1">/시간</small></span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors">bookmark</button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 flex flex-col justify-between min-h-[260px] transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                <div className="flex flex-col gap-2">
                  <span className="text-on-surface-variant font-bold text-sm block mb-2">베이커리 온</span>
                  <h3 className="text-xl font-bold leading-tight mb-2">가로수길 베이커리 카페 마감 청소 및 포장 파트</h3>
                  <div className="flex gap-2 text-on-surface-variant text-xs font-semibold">
                    <span>서울 강남구</span>
                    <span>•</span>
                    <span>월-금 고정</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-6">
                  <span className="text-2xl font-black text-on-surface">10,500원<small className="text-xs font-bold text-on-surface-variant ml-1">/시간</small></span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors">bookmark</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Total Jobs Section */}
        <section className="bg-white py-10">
          <div className="custom-container">
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-extrabold tracking-tighter">전체 공고</h2>
                <div className="px-4 py-1.5 bg-primary-soft text-primary rounded-md text-sm font-bold">최신순</div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <Link to="/recruit-information?tab=SHORT&sort=LATEST" className="px-6 py-2.5 bg-white border border-[#e0e0e0] text-[#555555] rounded-full text-sm font-bold whitespace-nowrap hover:bg-gray-50 transition-colors">단기</Link>
                <Link to="/recruit-information?tab=LONG&sort=LATEST" className="px-6 py-2.5 bg-white border border-[#e0e0e0] text-[#555555] rounded-full text-sm font-bold whitespace-nowrap hover:bg-gray-50 transition-colors">중장기</Link>
                <Link to={latestRecruitLink} className="px-6 py-2.5 bg-white border border-[#e0e0e0] text-[#555555] rounded-full text-sm font-bold whitespace-nowrap hover:bg-gray-50 transition-colors">맞춤 필터</Link>
              </div>
            </div>

            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#e8e8e8] text-on-surface-variant text-xs font-bold uppercase tracking-wider">
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
          </div>
        </section>
      </main>
      <AppFooter />
      <MobileBottomNav />

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
