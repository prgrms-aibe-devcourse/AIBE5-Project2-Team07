import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import TopNavBar from '../../TopNavBar';
import MobileBottomNav from '../../MobileBottomNav';
import AppFooter from '../../AppFooter';
import CommonButton from '../../CommonButton';
import KakaoMap from '../../KakaoMap';
import ReviewListModal from '../../review/ReviewListModal';
import { getBusinessApplications, decideBusinessApplication } from '../../../services/applyApi';
import { deleteMyBusinessRecruit, updateMyBusinessRecruitStatus } from '../../../services/accountApi';
import { getPublicReviewsByTarget } from '../../../services/reviewApi';
import { getReviewLabelNames, normalizeReview } from '../../../utils/mypageUtils';

const API_PREFIXES = ['/api', ''];

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

function parseDateToTime(value) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function formatAppliedDate(dateText) {
  if (!dateText) return '-';
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return dateText;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function renderStars(rating, className = 'text-lg') {
  const safeRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return (
    <div className="flex text-primary">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={`star-${index}`}
          className={`material-symbols-outlined ${className}`}
          style={index < safeRating ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          {index < safeRating ? 'star' : 'star_outline'}
        </span>
      ))}
    </div>
  );
}

function normalizeRecruitStatus(status) {
  return String(status || '').toUpperCase();
}

function resolveImageUrl(rawUrl) {
  if (!rawUrl) {
    return 'https://placehold.co/120x120?text=LOGO';
  }
  if (/^(https?:)?\/\//.test(rawUrl) || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) {
    return rawUrl;
  }
  if (rawUrl.startsWith('/')) {
    return rawUrl;
  }
  return `/${rawUrl}`;
}

export default function RecruitDetailPage({ embedded = false }) {
  const [searchParams] = useSearchParams();
  const recruitId = searchParams.get('recruitId');

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasAcceptedOrCompletedApplicants, setHasAcceptedOrCompletedApplicants] = useState(false);
  const [pendingApplyIds, setPendingApplyIds] = useState([]);
  const [isRecruitActionLoading, setIsRecruitActionLoading] = useState(false);
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
        const result = await fetchJsonWithFallback(`/recruits/${recruitId}`);
        setDetail(result);
      } catch (fetchError) {
        setError(fetchError.message || '공고 상세 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitDetail();
  }, [recruitId]);

  const fullAddress = useMemo(() => {
    if (!detail) {
      return '-';
    }
    if (detail.fullAddress) {
      return detail.fullAddress;
    }
    if (detail.detailAddress) {
      return detail.detailAddress;
    }
    if (detail.regionName) {
      return detail.regionName;
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
  const isOpenStatus = useMemo(() => normalizeRecruitStatus(detail?.status) === 'OPEN', [detail?.status]);
  const deadlineBadgeText = useMemo(() => (isOpenStatus ? getDday(detail?.deadline) : '마감'), [isOpenStatus, detail?.deadline]);
  const reviewTargetId = useMemo(
    () => detail?.businessMemberId ?? detail?.memberId ?? null,
    [detail?.businessMemberId, detail?.memberId],
  );

  const moveToBusinessTab = (tabId) => {
    const nextParams = new URLSearchParams();
    nextParams.set('tab', tabId);
    if (tabId === 'applicants' && recruitId) {
      nextParams.set('recruitId', recruitId);
    }
    navigate(`/dashboard?${nextParams.toString()}`);
  };

  useEffect(() => {
    let mounted = true;

    const fetchApplicantStatusSummary = async () => {
      if (!recruitId || !isOpenStatus) {
        if (mounted) {
          setHasAcceptedOrCompletedApplicants(false);
          setPendingApplyIds([]);
        }
        return;
      }

      try {
        let page = 0;
        let totalPages = 1;
        const allApplications = [];

        while (page < totalPages) {
          const response = await getBusinessApplications({ recruitId, page, size: 50 });
          const content = Array.isArray(response?.content) ? response.content : [];
          allApplications.push(...content);

          totalPages = Number.isFinite(response?.totalPages) ? response.totalPages : 1;
          page += 1;
        }

        if (!mounted) return;

        const hasAcceptedOrCompleted = allApplications.some((item) => {
          const status = String(item?.status || '').toUpperCase();
          return status === 'ACCEPTED' || status === 'COMPLETED';
        });

        const pendingIds = allApplications
          .filter((item) => String(item?.status || '').toUpperCase() === 'PENDING' && item?.id)
          .map((item) => item.id);

        setHasAcceptedOrCompletedApplicants(hasAcceptedOrCompleted);
        setPendingApplyIds(pendingIds);
      } catch {
        if (mounted) {
          setHasAcceptedOrCompletedApplicants(false);
          setPendingApplyIds([]);
        }
      }
    };

    fetchApplicantStatusSummary();

    return () => {
      mounted = false;
    };
  }, [recruitId, isOpenStatus]);

  useEffect(() => {
    if (!reviewTargetId) {
      setReviews([]);
      return;
    }

    let mounted = true;
    const loadReviews = async () => {
      try {
        setReviewLoading(true);
        setReviewError('');
        const response = await getPublicReviewsByTarget(reviewTargetId);
        if (!mounted) return;
        const list = Array.isArray(response) ? response.map(normalizeReview) : [];
        setReviews(list);
      } catch (fetchError) {
        if (!mounted) return;
        setReviewError(fetchError?.message || '리뷰를 불러오지 못했습니다.');
        setReviews([]);
      } finally {
        if (mounted) setReviewLoading(false);
      }
    };

    loadReviews();
    return () => {
      mounted = false;
    };
  }, [reviewTargetId]);

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

  const rejectPendingApplications = async () => {
    if (pendingApplyIds.length === 0) return;
    await Promise.all(pendingApplyIds.map((applyId) => decideBusinessApplication(applyId, false)));
  };

  const handleRecruitDelete = async () => {
    if (!recruitId || isRecruitActionLoading) return;
    const confirmed = window.confirm('공고를 삭제할까요? 대기 중 지원은 모두 거절 처리됩니다.');
    if (!confirmed) return;

    try {
      setIsRecruitActionLoading(true);
      await rejectPendingApplications();
      await deleteMyBusinessRecruit(recruitId);
      window.alert('공고가 삭제되었습니다.');
      moveToBusinessTab('recruits');
    } catch (actionError) {
      window.alert(actionError?.message || '공고 삭제에 실패했습니다.');
    } finally {
      setIsRecruitActionLoading(false);
    }
  };

  const handleRecruitStatusToggle = async () => {
    if (!recruitId || isRecruitActionLoading) return;
    const nextStatus = isOpenStatus ? 'CLOSED' : 'OPEN';
    const confirmed = window.confirm(`공고 상태를 ${nextStatus === 'OPEN' ? '모집 중' : '마감'}으로 변경할까요?`);
    if (!confirmed) return;

    try {
      setIsRecruitActionLoading(true);
      if (nextStatus === 'CLOSED') {
        await rejectPendingApplications();
      }
      await updateMyBusinessRecruitStatus(recruitId, nextStatus);
      window.alert('공고 상태가 변경되었습니다.');
      moveToBusinessTab('recruits');
    } catch (actionError) {
      window.alert(actionError?.message || '공고 상태 변경에 실패했습니다.');
    } finally {
      setIsRecruitActionLoading(false);
    }
  };


  return (
    <>
      {!embedded && <TopNavBar />}
      <main className={embedded ? 'bg-white border border-outline rounded-2xl p-6' : 'max-w-4xl mx-auto px-6 py-12 pt-32 pb-40'}>
        {hasAcceptedOrCompletedApplicants && isOpenStatus && (
          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            진행 중 근무자가 있어 공고를 마감하면 대기 중 지원은 자동 거절됩니다.
          </div>
        )}

        <section className="mb-6">
          <div className="bg-white border border-outline rounded-2xl px-6 py-4">
            <div className="flex flex-wrap md:flex-nowrap items-stretch gap-2">
              <CommonButton type="button" variant="subtle" size="full" onClick={() => moveToBusinessTab('applicants')}>
                제의/지원 현황
              </CommonButton>
              <CommonButton type="button" variant="subtle" size="full" onClick={() => moveToBusinessTab('reviews')}>
                리뷰 관리
              </CommonButton>
              <CommonButton type="button" size="full" onClick={() => moveToBusinessTab('work')}>
                근무 관리
              </CommonButton>
              <CommonButton
                type="button"
                variant="outline"
                size="full"
                onClick={handleRecruitStatusToggle}
                disabled={isRecruitActionLoading}
              >
                {isRecruitActionLoading ? '처리 중...' : (isOpenStatus ? '마감' : '재오픈')}
              </CommonButton>
              <CommonButton
                type="button"
                variant="outline"
                size="full"
                onClick={handleRecruitDelete}
                disabled={isRecruitActionLoading}
                className="text-red-600 border-red-200"
              >
                삭제
              </CommonButton>
            </div>
          </div>
        </section>

        {loading && <p className="py-10 text-on-surface-variant">공고를 불러오는 중입니다...</p>}
        {!loading && error && <p className="py-10 text-red-600">{error}</p>}

        {!loading && !error && detail && (
          <>
            <section className="mb-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="editorial-line">
                  <div className="flex items-center gap-3 mb-2">
                    {detail.brandId != null && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-900 text-white">
                        BRAND
                      </span>
                    )}
                    <span className="bg-primary-soft text-primary px-2 py-0.5 text-xs font-bold rounded">
                      {formatEnumList(detail.businessType, BUSINESS_LABELS)}
                    </span>
                    <span className="text-on-surface-variant text-sm font-medium">{detail.companyName || '-'}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tighter">
                      {detail.title}
                    </h1>
                  </div>
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
                      {(Array.isArray(detail.workDays) && detail.workDays.length > 0) ? detail.workDays.map((day) => (
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
                    <span className="block text-xs text-on-surface-variant mb-1">마감일</span>
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
                    lat={detail.latitude || 37.5665}
                    lng={detail.longitude || 126.978}
                    level={3}
                    address={fullAddress}
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
              </section>

              <section className="bg-surface-container-low p-8 rounded-2xl border border-outline">
                <div className="flex justify-between items-center mb-6 gap-3">
                  <h3 className="font-headline text-xl font-bold">근무 후기</h3>
                  <button
                    type="button"
                    className="text-primary text-xs font-bold hover:underline"
                    onClick={() => setShowReviewModal(true)}
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
                        <span className="text-sm text-on-surface-variant">아직 강조 라벨이 없습니다.</span>
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
                      <p className="text-sm text-on-surface-variant">대표/사업자번호 정보는 기업 상세 API 연동 예정</p>
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
                  <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">location_on</span> 주소: {displayAddress}</p>
                  <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">language</span> 홈페이지: {detail.homepageUrl || '-'}</p>
                  <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">call</span> 연락처: {detail.companyPhone || '-'}</p>
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      <ReviewListModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        reviews={sortedReviews}
        title="근무 후기 전체 보기"
      />


      {!embedded && <AppFooter />}
      {!embedded && <MobileBottomNav />}
    </>
  );
}



