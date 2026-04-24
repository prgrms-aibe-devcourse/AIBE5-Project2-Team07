import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import MobileBottomNav from '../components/MobileBottomNav';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import KakaoMap from '../components/KakaoMap';
import { getStoredMember, getToken } from '../services/authApi';
import { getMyResume } from '../services/resumeApi';
import { getMyApplications } from '../services/applyApi';
import { getPublicReviewsByTarget } from '../services/reviewApi';
import { addRecruitScrap, getMyScrapRecruitIds, removeRecruitScrap } from '../services/scrapRecruitApi';
import { getReviewLabelNames, normalizeReview } from '../utils/mypageUtils';
import ReviewListModal from '../components/review/ReviewListModal';

const DEFAULT_API_PREFIXES = ['/api', ''];

const PERIOD_LABELS = {
  OneDay: '하루',
  OneWeek: '1주 이하',
  OneMonth: '1개월 이하',
  ThreeMonths: '3개월 이하',
  SixMonths: '6개월 이하',
  OneYear: '1년 이하',
  MoreThanOneYear: '1년 이상'
};

const DAY_LABELS = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일'
};

const DAY_ORDER = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const TIME_LABELS = {
  MORNING: '오전',
  AFTERNOON: '오후',
  EVENING: '저녁',
  NIGHT: '새벽',
  MORNING_AFTERNOON: '오전~오후',
  AFTERNOON_EVENING: '오후~저녁',
  EVENING_NIGHT: '저녁~새벽',
  NIGHT_MORNING: '새벽~오전',
  FULLTIME: '풀타임'
};

const BUSINESS_LABELS = {
  FOOD_RESTAURANT: '외식',
  CAFE: '카페',
  RETAIL_STORE: '매장관리/판매',
  SERVICE: '서비스',
  DELIVERY_DRIVER: '운전/배달',
  MANUAL_LABOR: '현장단순노무'
};

async function fetchJsonWithFallback(path, options = {}) {
  const { prefixes = DEFAULT_API_PREFIXES, retryStatuses = [404] } = options;
  let lastError = null;

  for (const prefix of prefixes) {
    try {
      const response = await fetch(`${prefix}${path}`);
      if (response.ok) {
        return response.json();
      }
      if (retryStatuses.includes(response.status)) {
        continue;
      }
      const errorText = await response.text();
      throw new Error(errorText || `요청 실패 (${response.status})`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('상세 조회에 실패했습니다.');
}

function formatEnumList(values, labelMap) {
  if (!Array.isArray(values) || values.length === 0) {
    return '-';
  }
  return values.map((value) => labelMap[value] || value).join(', ');
}

function formatSalaryAmount(salary) {
  if (salary == null) {
	return '-';
  }
  return `${Number(salary).toLocaleString('ko-KR')}원`;
}

function getSalaryTypeMeta(salaryType) {
  if (salaryType === 'MONTHLY') {
	return {
	  label: '월급',
	  className: 'bg-rose-500 text-rose-100 border border-rose-100'
	};
  }
  return {
	label: '시급',
	className: 'bg-rose-100 text-rose-500 border border-rose-200'
  };
}

function formatAddressSpaced(address) {
  if (!address || address === '-') {
	return '-';
  }
  return address
	.replace(/([가-힣])(시|도|군|구)(?=[가-힣])/g, '$1$2 ')
	.replace(/\s+/g, ' ')
	.trim();
}

function parseCoordinate(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function hasValidCoordinates(lat, lng) {
  return lat != null && lng != null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
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

function formatAppliedDate(dateText) {
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
  }).format(date);
}

function normalizeRecruitStatus(status) {
  return String(status || '').toUpperCase();
}

function parseDateToTime(value) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function renderStars(rating, className = 'text-lg') {
  const safeRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return (
    <div className="flex text-primary">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={`star-${index}`} className={`material-symbols-outlined ${className}`}>
          {index < safeRating ? 'star' : 'star_outline'}
        </span>
      ))}
    </div>
  );
}

function resolveImageUrl(rawUrl) {
  if (!rawUrl) {
    return 'https://placehold.co/120x120?text=LOGO';
  }
  if (/^(https?:)?\/\//.test(rawUrl) || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) {
    return rawUrl;
  }
  // /uploads/... 같은 서버 상대경로는 그대로 반환
  // → 개발 시 Vite proxy(/uploads)가 처리, 프로덕션 시 동일 origin에서 서빙
  if (rawUrl.startsWith('/')) {
    return rawUrl;
  }
  return `/${rawUrl}`;
}

export default function RecruitDetailPage() {
  const [searchParams] = useSearchParams();
  const recruitId = searchParams.get('recruitId');

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showResumeRequiredModal, setShowResumeRequiredModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyActionLoading, setApplyActionLoading] = useState(false);
  const [applyActionError, setApplyActionError] = useState('');
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const [appliedAt, setAppliedAt] = useState('');
  const [appliedCheckLoading, setAppliedCheckLoading] = useState(false);
  const [isScrapped, setIsScrapped] = useState(false);
  const [scrapLoading, setScrapLoading] = useState(false);
  const [scrapError, setScrapError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecruitDetail = async () => {
      if (!recruitId) {
        setError('공고 ID가 없습니다. 목록에서 다시 진입해 주세요.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const result = await fetchJsonWithFallback(`/recruits/${recruitId}`, { prefixes: [''] });
        setDetail(result);
      } catch (fetchError) {
        setError(fetchError.message || '공고 상세 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitDetail();
  }, [recruitId]);

  useEffect(() => {
    const businessMemberId = detail?.businessMemberId;
    if (!businessMemberId) {
      setReviews([]);
      return;
    }

    const loadReviews = async () => {
      try {
        setReviewLoading(true);
        setReviewError('');
        const response = await getPublicReviewsByTarget(businessMemberId);
        const list = Array.isArray(response) ? response.map(normalizeReview) : [];
        setReviews(list);
      } catch (fetchError) {
        setReviewError(fetchError.message || '리뷰를 불러오지 못했습니다.');
        setReviews([]);
      } finally {
        setReviewLoading(false);
      }
    };

    loadReviews();
  }, [detail?.businessMemberId]);

  useEffect(() => {
    let isMounted = true;

    const loadScrapState = async () => {
      setIsScrapped(false);
      setScrapError('');

      if (!recruitId) {
        return;
      }

      const token = getToken();
      const member = getStoredMember();
      if (!token || !member || member.memberType !== 'INDIVIDUAL') {
        return;
      }

      try {
        const ids = await getMyScrapRecruitIds(member.id);
        if (!isMounted) {
          return;
        }
        setIsScrapped(ids.includes(Number(recruitId)));
      } catch {
        if (isMounted) {
          setIsScrapped(false);
        }
      }
    };

    loadScrapState();

    return () => {
      isMounted = false;
    };
  }, [recruitId]);

  useEffect(() => {
    const checkAlreadyApplied = async () => {
      setIsAlreadyApplied(false);
      setAppliedAt('');

      if (!recruitId) {
        return;
      }

      const token = getToken();
      const member = getStoredMember();
      if (!token || !member || member.memberType !== 'INDIVIDUAL') {
        return;
      }

      try {
        setAppliedCheckLoading(true);
        const targetRecruitId = Number(recruitId);
        let currentPage = 0;
        let totalPages = 1;
        let applied = false;
        let appliedCreatedAt = '';

        while (currentPage < totalPages && !applied) {
          const applications = await getMyApplications(member.id, currentPage, 100);
          const items = Array.isArray(applications?.content) ? applications.content : [];
          const matched = items.find((item) => Number(item?.recruitId) === targetRecruitId);
          applied = Boolean(matched);
          if (matched?.createdAt) {
            appliedCreatedAt = matched.createdAt;
          }
          totalPages = Math.max(Number(applications?.totalPages) || 1, 1);
          currentPage += 1;
        }

        setIsAlreadyApplied(applied);
        setAppliedAt(appliedCreatedAt);
      } catch {
        // 이미 지원 여부 조회 실패는 지원 기능 자체를 막지 않습니다.
      } finally {
        setAppliedCheckLoading(false);
      }
    };

    checkAlreadyApplied();
  }, [recruitId]);

  const fullAddress = useMemo(() => {
    if (!detail) {
      return '-';
    }
    if (detail.fullAddress && detail.fullAddress !== '-') {
      return detail.fullAddress;
    }
    const combined = [detail.regionName, detail.detailAddress].filter(Boolean).join(' ').trim();
    if (combined) {
      return combined;
    }
    if (detail.regionId != null) {
      return `지역 ID ${detail.regionId}`;
    }
    return '-';
  }, [detail]);

  const descriptionLines = useMemo(() => {
    if (!detail?.description) {
      return [];
    }
    return detail.description
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }, [detail]);

  const salaryTypeMeta = useMemo(() => getSalaryTypeMeta(detail?.salaryType), [detail?.salaryType]);
  const displayAddress = useMemo(() => formatAddressSpaced(fullAddress), [fullAddress]);
  const parsedLatitude = useMemo(() => parseCoordinate(detail?.latitude), [detail?.latitude]);
  const parsedLongitude = useMemo(() => parseCoordinate(detail?.longitude), [detail?.longitude]);
  const mapLatitude = hasValidCoordinates(parsedLatitude, parsedLongitude) ? parsedLatitude : 37.5665;
  const mapLongitude = hasValidCoordinates(parsedLatitude, parsedLongitude) ? parsedLongitude : 126.978;
  const mapAddress = displayAddress !== '-' ? displayAddress : (detail?.companyName || '근무지');
  const sortedWorkDays = useMemo(() => {
    if (!Array.isArray(detail?.workDays)) {
      return [];
    }

    return [...new Set(detail.workDays)].sort((a, b) => {
      const indexA = DAY_ORDER.indexOf(a);
      const indexB = DAY_ORDER.indexOf(b);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [detail?.workDays]);
  const isOpenStatus = useMemo(() => normalizeRecruitStatus(detail?.status) === 'OPEN', [detail?.status]);
  const isOneDayRecruit = useMemo(() => Array.isArray(detail?.workPeriod) && detail.workPeriod.includes('OneDay'), [detail?.workPeriod]);
  const deadlineBadgeText = useMemo(() => (isOpenStatus ? getDday(detail?.deadline) : '마감'), [isOpenStatus, detail?.deadline]);
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const diff = parseDateToTime(b?.writtenAt) - parseDateToTime(a?.writtenAt);
      if (diff !== 0) return diff;
      return Number(b?.id || 0) - Number(a?.id || 0);
    });
  }, [reviews]);
  const averageRating = useMemo(() => {
    if (sortedReviews.length === 0) return 0;
    const sum = sortedReviews.reduce((acc, review) => acc + Number(review?.rating || 0), 0);
    return sum / sortedReviews.length;
  }, [sortedReviews]);
  const topLabels = useMemo(() => {
    const labelCountMap = new Map();
    sortedReviews.forEach((review) => {
      getReviewLabelNames(review).forEach((label) => {
        labelCountMap.set(label, (labelCountMap.get(label) || 0) + 1);
      });
    });
    return [...labelCountMap.entries()]
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0], 'ko');
      })
      .slice(0, 2);
  }, [sortedReviews]);
  const latestTwoReviews = useMemo(() => sortedReviews.slice(0, 2), [sortedReviews]);

  const handleApplyClick = async () => {
    if (!isOpenStatus || isAlreadyApplied) {
      return;
    }

    const token = getToken();
    const member = getStoredMember();

    if (!token || !member) {
      setShowLoginModal(true);
      return;
    }

    if (member.memberType !== 'INDIVIDUAL') {
      setShowBusinessModal(true);
      return;
    }

    try {
      setApplyActionLoading(true);
      setApplyActionError('');
      await getMyResume();
      navigate(`/apply-form?recruitId=${recruitId}`);
    } catch (resumeError) {
      if (resumeError.message === 'Resume not found') {
        setShowResumeRequiredModal(true);
        return;
      }
      setApplyActionError(resumeError.message || '지원 준비 중 오류가 발생했습니다.');
    } finally {
      setApplyActionLoading(false);
    }
  };

  const handleScrapClick = async () => {
    if (!recruitId || scrapLoading) {
      return;
    }

    const token = getToken();
    const member = getStoredMember();

    if (!token || !member) {
      setShowLoginModal(true);
      return;
    }

    if (member.memberType !== 'INDIVIDUAL') {
      setShowBusinessModal(true);
      return;
    }

    const numericRecruitId = Number(recruitId);

    try {
      setScrapLoading(true);
      setScrapError('');

      if (isScrapped) {
        await removeRecruitScrap(member.id, numericRecruitId);
        setIsScrapped(false);
      } else {
        await addRecruitScrap(member.id, numericRecruitId);
        setIsScrapped(true);
      }
    } catch (scrapActionError) {
      setScrapError(scrapActionError.message || '공고 스크랩 중 오류가 발생했습니다.');
    } finally {
      setScrapLoading(false);
    }
  };

  return (
    <>
      <TopNavBar />
      <main className="max-w-4xl mx-auto px-6 py-12 pt-32 pb-40">
        {loading && <p className="py-10 text-on-surface-variant">공고를 불러오는 중입니다...</p>}
        {!loading && error && <p className="py-10 text-red-600">{error}</p>}

        {!loading && !error && detail && (
          <>
            <section className="mb-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="editorial-line">
                  <div className="flex items-center gap-3 mb-2">
                    {detail.brandId != null && (
					  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[18px] font-bold bg-zinc-900 text-white">
						BRAND
					  </span>
					)}
                    <span className="bg-primary-soft text-primary px-2 py-0.5 text-xs font-bold rounded">
                      {formatEnumList(detail.businessType, BUSINESS_LABELS)}
                    </span>
                    <span className="text-on-surface-variant text-sm font-medium">{detail.companyName || '-'}</span>
                  </div>
                  <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tighter">
                    {detail.title}
                  </h1>
                </div>
                {detail.brandId != null && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center shrink-0 border border-outline">
                    <img className="w-full h-full object-cover" alt="brand logo" src={resolveImageUrl(detail.logoImg)} />
                  </div>
                )}
              </div>
            </section>

            <div className="space-y-16">
              <section>
                <div className="flex items-center mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-primary">모집요강 요약</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                    <span className="block text-xs text-on-surface-variant mb-1">급여</span>
                    <div className="inline-flex items-center gap-2 max-w-full">
					  <span className="text-xl font-bold text-on-surface truncate">{formatSalaryAmount(detail.salary)}</span>
					  <span className={`inline-flex shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold ${salaryTypeMeta.className}`}>
						{salaryTypeMeta.label}
					  </span>
					</div>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                    <span className="block text-xs text-on-surface-variant mb-1">근무기간</span>
                    <span className="text-xl font-bold">{formatEnumList(detail.workPeriod, PERIOD_LABELS)}</span>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                    <span className="block text-xs text-on-surface-variant mb-1">근무요일</span>
                    <div className="flex flex-wrap gap-1.5">
            {sortedWorkDays.length > 0 ? sortedWorkDays.map((day) => (
            <span key={day} className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-primary-soft text-primary border border-primary/20">
						  {DAY_LABELS[day] || day}
						</span>
					  )) : <span className="text-xl font-bold">-</span>}
					</div>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                    <span className="block text-xs text-on-surface-variant mb-1">근무시간</span>
                    <span className="text-xl font-bold">{formatEnumList(detail.workTime, TIME_LABELS)}</span>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                    <span className="block text-xs text-on-surface-variant mb-1">모집 인원</span>
                    <span className="text-xl font-bold">{detail.headCount ? `${detail.headCount}명` : '-'}</span>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                    <span className="block text-xs text-on-surface-variant mb-1">{isOneDayRecruit ? '근무일자(마감일)' : '마감일'}</span>
                    <div className="flex items-center gap-2">
					  <span className="text-xl font-bold">{detail.deadline || '-'}</span>
					  <span className={`px-3 py-1 rounded-full text-xs font-black ${isOpenStatus ? 'bg-primary text-white' : 'bg-gray-400 text-white'}`}>{deadlineBadgeText}</span>
					</div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-2xl border border-outline">
                <h3 className="font-headline text-2xl font-bold mb-6">상세 모집요강</h3>
                {descriptionLines.length > 0 ? (
                  <ul className="space-y-2 text-on-surface">
                    {descriptionLines.map((line, index) => (
                      <li key={`${line}-${index}`} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-on-surface-variant">상세 설명이 등록되지 않았습니다.</p>
                )}
              </section>

              <section>
                <h3 className="font-headline text-2xl font-bold mb-6">근무지 위치</h3>
                <div className="bg-surface-container rounded-2xl overflow-hidden relative mb-4 h-[400px] border border-outline">
                  <KakaoMap
                    lat={mapLatitude}
                    lng={mapLongitude}
                    level={3}
                    address={mapAddress}
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border border-outline shadow-none">
                    <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                    {displayAddress}
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-2 text-sm text-on-surface">
				  <span className="material-symbols-outlined text-primary text-base">location_on</span>
				  <span className="font-medium">근무지 주소: {displayAddress}</span>
				</div>
{/*                 <div className="text-sm text-on-surface-variant"> */}
{/*                   {detail.latitude && detail.longitude ? '정확한 좌표로 표시 중입니다.' : '위/경도 데이터가 없어 기본 좌표로 표시 중입니다.'} */}
{/*                 </div> */}
              </section>

              <section className="bg-surface-container-low p-8 rounded-2xl border border-outline">
                <div className="flex justify-between items-center mb-6 gap-3">
                  <h3 className="font-headline text-xl font-bold">근무 후기</h3>
                  <button
                    type="button"
                    className="text-primary text-xs font-bold hover:underline"
                    onClick={() => setShowReviewModal(true)}
                    disabled={sortedReviews.length === 0}
                  >
                    리뷰 더보기 +
                  </button>
                </div>

                {reviewLoading && <p className="text-sm text-on-surface-variant">리뷰를 불러오는 중입니다...</p>}
                {!reviewLoading && reviewError && <p className="text-sm text-red-600">{reviewError}</p>}

                {!reviewLoading && !reviewError && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      {renderStars(averageRating)}
                      <span className="font-black text-lg text-on-surface">{averageRating.toFixed(1)}</span>
                      <span className="text-on-surface-variant text-sm">/ 5.0 · 리뷰 {sortedReviews.length}개</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {topLabels.length > 0 ? topLabels.map(([label, count]) => (
                        <span key={label} className="text-xs font-bold bg-[#FFF0F3] text-primary px-2.5 py-1 rounded-full">
                          #{label} ({count})
                        </span>
                      )) : (
                        <span className="text-sm text-on-surface-variant"></span>
                      )}
                    </div>

                    {latestTwoReviews.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {latestTwoReviews.map((review) => (
                          <article key={review.id} className="bg-white rounded-xl border border-outline p-5 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              {renderStars(review.rating, 'text-base')}
                              <span className="text-xs text-on-surface-variant">{formatAppliedDate(review.writtenAt)}</span>
                            </div>
                            <p className="text-sm text-on-surface leading-relaxed break-words">
                              {review.content || '리뷰 내용이 없습니다.'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {getReviewLabelNames(review).map((label, index) => (
                                <span key={`${review.id}-label-${index}`} className="text-[11px] font-bold bg-[#FFF0F3] text-primary px-2.5 py-0.5 rounded-full">
                                  {label}
                                </span>
                              ))}
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-on-surface-variant">아직 리뷰가 없네요. 첫 리뷰를 남겨주시면 큰 도움이 돼요!</p>
                    )}
                  </>
                )}
              </section>

              <section className="p-8 rounded-2xl bg-white border border-outline">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-6">
                    {detail.brandId != null && (
                      <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-3 border border-outline">
                        <img className="w-full h-full object-contain" alt="brand logo" src={resolveImageUrl(detail.logoImg)} />
                      </div>
                    )}
                    <div>
                      <h5 className="font-bold text-lg text-on-surface">{detail.companyName || '-'}</h5>
                    </div>
                  </div>
                  <Link
                    to={`/company-detail?recruitId=${detail?.id || recruitId}${detail?.brandId != null ? `&brandId=${detail.brandId}` : ''}`}
                    className="flex items-center gap-1 text-primary font-bold text-sm hover:underline underline-offset-2 transition-all"
                  >
                    기업 정보 더보기
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-on-surface-variant">
                  <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">location_on</span> 주소: {displayAddress}</p>
                  <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">language</span> 홈페이지: {detail.homepageUrl || '-'}</p>
                  <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">call</span> 연락처: {detail.companyPhone || '-'}</p>
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-outline px-6 py-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="flex items-center gap-6 shrink-0">
            <button
              type="button"
              className={`flex flex-col items-center gap-1 transition-colors ${isScrapped ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} ${scrapLoading ? 'opacity-50 cursor-wait' : ''}`}
              onClick={handleScrapClick}
              disabled={scrapLoading}
              aria-pressed={isScrapped}
              aria-label="공고 스크랩"
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isScrapped ? '"FILL" 1' : '"FILL" 0' }}>bookmark</span>
              <span className="text-[10px] font-bold">스크랩</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">chat</span>
              <span className="text-[10px] font-bold">채팅</span>
            </button>
          </div>
          <div className="h-10 w-px bg-outline/30 mx-2 hidden md:block"></div>
          <div className="flex-1 flex gap-3">
            <CommonButton
              variant="subtle"
              size="full"
              disabled={!isOpenStatus}
              className={`flex-1 rounded-xl ${isOpenStatus ? 'bg-surface-container hover:bg-surface-variant' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              이메일 지원
            </CommonButton>
            <CommonButton
              onClick={isOpenStatus && !isAlreadyApplied ? handleApplyClick : undefined}
              disabled={!isOpenStatus || applyActionLoading || appliedCheckLoading || isAlreadyApplied}
              className={`flex-[2] w-auto px-6 py-4 rounded-xl ${
                isAlreadyApplied
                  ? 'bg-emerald-100 hover:bg-emerald-100 text-emerald-700 cursor-not-allowed'
                  : isOpenStatus
                    ? ''
                    : 'bg-gray-300 hover:bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              {isOpenStatus
                ? (isAlreadyApplied
                  ? `지원 완료 · ${formatAppliedDate(appliedAt)}`
                  : (applyActionLoading || appliedCheckLoading ? '지원 정보 확인 중...' : '온라인 지원하기'))
                : '마감된 공고입니다'}
            </CommonButton>
          </div>
        </div>
        {applyActionError && (
          <p className="max-w-4xl mx-auto mt-3 text-sm text-red-600 font-medium">{applyActionError}</p>
        )}
        {scrapError && (
          <p className="max-w-4xl mx-auto mt-2 text-sm text-red-600 font-medium">{scrapError}</p>
        )}
      </div>

      <AppFooter />
      <MobileBottomNav />

      <ReviewListModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        reviews={sortedReviews}
        title="근무 후기 전체 보기"
      />

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
            공고 스크랩과 온라인 지원은 개인 회원 로그인 후 이용하실 수 있습니다.<br />
            로그인 후 원하는 공고를 저장하고 간편하게 지원해 보세요!
          </p>
          <div className="w-full flex flex-col gap-3">
            <CommonButton size="full" to="/login" onClick={() => setShowLoginModal(false)}>
              개인 회원 로그인
            </CommonButton>
            <CommonButton variant="subtle" size="full" to="/signup/personal" onClick={() => setShowLoginModal(false)}>
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

      <div className={`${showBusinessModal ? '' : 'hidden'} fixed inset-0 z-[100] flex items-center justify-center p-6`}>
        <div
          className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          onClick={() => setShowBusinessModal(false)}
        ></div>
        <div className="relative bg-white w-full max-w-md p-10 rounded-2xl flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mb-6">
            <span
              className="material-symbols-outlined text-primary text-4xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              business_center
            </span>
          </div>
          <h5 className="text-2xl font-bold mb-3">사업자 회원은 지원할 수 없습니다</h5>
          <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">
            공고 스크랩과 온라인 지원은 개인회원 전용 기능입니다.<br />
            개인회원 계정으로 로그인한 뒤 이용해 주세요.
          </p>
          <CommonButton size="full" onClick={() => setShowBusinessModal(false)}>
            확인
          </CommonButton>
        </div>
      </div>

      <div className={`${showResumeRequiredModal ? '' : 'hidden'} fixed inset-0 z-[100] flex items-center justify-center p-6`}>
        <div
          className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          onClick={() => setShowResumeRequiredModal(false)}
        ></div>
        <div className="relative bg-white w-full max-w-md p-10 rounded-2xl flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mb-6">
            <span
              className="material-symbols-outlined text-primary text-4xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              description
            </span>
          </div>
          <h5 className="text-2xl font-bold mb-3">이력서를 먼저 작성해주세요</h5>
          <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">
            온라인 지원을 하려면 등록된 이력서가 필요합니다.<br />
            이력서 관리 탭으로 이동해 먼저 작성해 주세요.
          </p>
          <div className="w-full flex flex-col gap-3">
            <CommonButton size="full" onClick={() => navigate('/personal-mypage?tab=resume')}>
              이력서 작성하기
            </CommonButton>
            <CommonButton variant="subtle" size="full" onClick={() => setShowResumeRequiredModal(false)}>
              닫기
            </CommonButton>
          </div>
        </div>
      </div>
    </>
  );
}
