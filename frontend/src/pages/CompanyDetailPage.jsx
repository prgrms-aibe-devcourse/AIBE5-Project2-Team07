import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import KakaoMap from '../components/KakaoMap';
import { getPublicReviewsByTarget } from '../services/reviewApi';
import { formatDate, getReviewLabelNames, normalizeReview } from '../utils/mypageUtils';
import ReviewListModal from '../components/review/ReviewListModal';

const DEFAULT_API_PREFIXES = ['/api', ''];

async function fetchJsonWithFallback(path, options = {}) {
  const { prefixes = DEFAULT_API_PREFIXES, retryStatuses = [404] } = options;
  let lastError = null;

  for (const prefix of prefixes) {
    try {
      const response = await fetch(`${prefix}${path}`);
      if (response.ok) return response.json();
      if (retryStatuses.includes(response.status)) continue;
      const errorText = await response.text();
      throw new Error(errorText || `요청 실패 (${response.status})`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('기업 정보를 불러오지 못했습니다.');
}

function resolveImageUrl(rawUrl) {
  if (!rawUrl) return '';
  if (/^(https?:)?\/\//.test(rawUrl) || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) return rawUrl;
  if (rawUrl.startsWith('/')) return rawUrl;
  return `/${rawUrl}`;
}

function formatAddressSpaced(address) {
  if (!address || address === '-') return '-';
  return String(address)
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

function maskName(name) {
  if (!name || typeof name !== 'string') return null;
  const s = name.trim();
  if (s.length === 0) return null;
  if (s.length === 1) return s;
  if (s.length === 2) return s[0] + '*';
  return s[0] + '*' + s[s.length - 1];
}

export default function CompanyDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recruitId = searchParams.get('recruitId');
  const brandId = searchParams.get('brandId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recruitDetail, setRecruitDetail] = useState(null);
  const [brandSummary, setBrandSummary] = useState(null);
  const [activeRecruits, setActiveRecruits] = useState([]);
  const [recruitsLoading, setRecruitsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const reviewTargetId = useMemo(
    () => recruitDetail?.businessMemberId ?? brandSummary?.businessMemberId ?? null,
    [recruitDetail?.businessMemberId, brandSummary?.businessMemberId]
  );

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const loadCompanyDetail = async () => {
      if (!recruitId && !brandId) {
        setError('기업 정보를 조회할 수 있는 공고/브랜드 정보가 없습니다.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError('');
        const [recruitData, brandData] = await Promise.all([
          recruitId
            ? fetchJsonWithFallback(`/recruits/${recruitId}`, { prefixes: [''] })
            : Promise.resolve(null),
          brandId
            ? fetchJsonWithFallback(`/brand/${brandId}/summary`, { prefixes: ['/api'] })
            : Promise.resolve(null),
        ]);
        setRecruitDetail(recruitData);
        setBrandSummary(brandData);
      } catch (fetchError) {
        setError(fetchError.message || '기업 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadCompanyDetail();
  }, [recruitId, brandId]);

  // 모집중인 공고 로드
  useEffect(() => {
    const loadRecruits = async () => {
      const businessMemberId = recruitDetail?.businessMemberId;

      setRecruitsLoading(true);
      try {
        let list = [];

        if (businessMemberId != null) {
          const data = await fetchJsonWithFallback(`/recruits/business/${businessMemberId}`, { prefixes: [''] });
          list = Array.isArray(data) ? data : [];
        } else {
          // 사업자 식별자가 없으면 지점 단위 필터가 불가능하므로 빈 목록 처리
          list = [];
        }

        const currentRecruitId = Number(recruitId);
        const openRecruits = list
          .filter((item) => Number(item?.id) !== currentRecruitId)
          .filter((item) => {
            const status = String(item?.status || '').toUpperCase();
            return !status || status === 'OPEN';
          })
          .slice(0, 6);

        setActiveRecruits(openRecruits);
      } catch {
        setActiveRecruits([]);
      } finally {
        setRecruitsLoading(false);
      }
    };
    if (!loading) loadRecruits();
  }, [loading, recruitDetail, recruitId]);

  useEffect(() => {
    if (!reviewTargetId) {
      setReviews([]);
      return;
    }

    const loadReviews = async () => {
      try {
        setReviewLoading(true);
        setReviewError('');
        const response = await getPublicReviewsByTarget(reviewTargetId);
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
  }, [reviewTargetId]);

  const companyName = useMemo(() => recruitDetail?.companyName || brandSummary?.name || '-', [recruitDetail, brandSummary]);
  const logoUrl = useMemo(() => {
    // 브랜드가 있는 기업만 로고 표시
    const resolvedBrandId = brandId || recruitDetail?.brandId;
    if (!resolvedBrandId) return '';
    return resolveImageUrl(brandSummary?.logoImg || recruitDetail?.logoImg);
  }, [recruitDetail, brandSummary, brandId]);

  const fullAddress = useMemo(() => {
    if (!recruitDetail) return '-';
    if (recruitDetail.fullAddress && recruitDetail.fullAddress !== '-') return recruitDetail.fullAddress;
    const combined = [recruitDetail.regionName, recruitDetail.detailAddress].filter(Boolean).join(' ');
    return combined || '-';
  }, [recruitDetail]);

  const displayAddress = useMemo(() => formatAddressSpaced(fullAddress), [fullAddress]);
  const parsedLatitude = useMemo(() => parseCoordinate(recruitDetail?.latitude), [recruitDetail?.latitude]);
  const parsedLongitude = useMemo(() => parseCoordinate(recruitDetail?.longitude), [recruitDetail?.longitude]);
  const latitude = hasValidCoordinates(parsedLatitude, parsedLongitude) ? parsedLatitude : 37.5665;
  const longitude = hasValidCoordinates(parsedLatitude, parsedLongitude) ? parsedLongitude : 126.978;
  const mapAddress = displayAddress !== '-' ? displayAddress : (companyName !== '-' ? companyName : '근무지');
  const resolvedBrandId = brandId || recruitDetail?.brandId;
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
  const memberAverageRating = useMemo(() => {
    const candidates = [recruitDetail, brandSummary];
    for (const source of candidates) {
      const ratingSum = Number(source?.ratingSum);
      const ratingCount = Number(source?.ratingCount);
      if (Number.isFinite(ratingSum) && Number.isFinite(ratingCount) && ratingCount > 0) {
        return ratingSum / ratingCount;
      }
    }
    return null;
  }, [recruitDetail, brandSummary]);
  const displayAverageRating = memberAverageRating ?? averageRating;
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

  return (
    <>
      <TopNavBar />
      <main className="pb-24 pt-24">

        {/* ── 기업 헤더 ── */}
        <section className="py-14 bg-white border-b border-outline">
          <div className="custom-container">
            {loading && <p className="text-on-surface-variant">기업 정보를 불러오는 중입니다...</p>}
            {!loading && error && <p className="text-red-600">{error}</p>}
            {!loading && !error && (
              <div className="flex flex-col sm:flex-row items-start gap-8">
                {/* 로고: 브랜드 있는 기업만 표시 */}
                {logoUrl && (
                  <div className="w-28 h-28 rounded-xl bg-[#F8F9FA] border border-outline flex items-center justify-center overflow-hidden shrink-0">
                    <img alt="company logo" className="w-full h-full object-contain" src={logoUrl} />
                  </div>
                )}
                <div className="space-y-2">
                  <span className="text-primary font-bold tracking-widest text-xs uppercase">기업 정보</span>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">{companyName}</h1>
                  <div className="flex flex-wrap gap-x-8 gap-y-1 pt-2 text-sm text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-on-surface-variant">설립일</span>
                      <span className="font-bold text-on-surface">{recruitDetail?.foundedDate || '-'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-on-surface-variant">전화번호</span>
                      <span className="font-bold text-on-surface">{recruitDetail?.companyPhone || '-'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-on-surface-variant">홈페이지</span>
                      {recruitDetail?.homepageUrl ? (
                        <a className="font-bold text-primary hover:underline" href={recruitDetail.homepageUrl} target="_blank" rel="noreferrer">
                          {recruitDetail.homepageUrl}
                        </a>
                      ) : (
                        <span className="font-bold text-on-surface">-</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {!loading && !error && (
          <>
            {/* ── 위치 섹션 ── */}
            <section className="py-16 bg-[#F8F9FA] border-b border-outline">
              <div className="custom-container">
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                  <div className="w-full lg:w-3/5 h-[360px] rounded-xl border border-outline overflow-hidden relative">
                    <KakaoMap lat={latitude} lng={longitude} level={3} address={mapAddress} />
                  </div>
                  <div className="w-full lg:w-2/5 space-y-4">
                    <h2 className="text-3xl font-black tracking-tight">근무지 위치</h2>
                    <p className="text-on-surface-variant leading-relaxed">{displayAddress}</p>
                    {recruitId && (
                      <Link to={`/recruit-detail?recruitId=${recruitId}`} className="inline-flex items-center gap-1 text-primary font-bold hover:underline">
                        관련 공고로 돌아가기
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ── 리뷰 섹션 (하드코딩 — 추후 API 연결) ── */}
            <section className="py-16 bg-white border-b border-outline">
              <div className="custom-container">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-black tracking-tight uppercase">근무 리뷰</h2>
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(true)}
                    className="border border-outline rounded-lg px-4 py-2 text-sm font-bold hover:bg-surface-variant transition-colors"
                  >
                    리뷰 더보기 +
                  </button>
                </div>
                {reviewLoading && <p className="text-on-surface-variant py-8">리뷰를 불러오는 중입니다...</p>}
                {!reviewLoading && reviewError && <p className="text-red-600 py-8">{reviewError}</p>}

                {!reviewLoading && !reviewError && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {renderStars(displayAverageRating)}
                      <span className="font-black text-lg">{displayAverageRating.toFixed(1)}</span>
                      <span className="text-on-surface-variant">/ 5.0</span>
                      <span className="text-on-surface-variant text-sm">리뷰 {sortedReviews.length}개</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {topLabels.length > 0 ? topLabels.map(([label, count]) => (
                        <span key={label} className="text-xs font-bold bg-[#FFF0F3] text-primary px-2.5 py-1 rounded-full">
                          #{label} ({count})
                        </span>
                      )) : (
                        <span className="text-sm text-on-surface-variant"></span>
                      )}
                    </div>

                    {latestTwoReviews.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {latestTwoReviews.map((review) => (
                          <div key={review.id} className="bg-[#F8F9FA] rounded-xl p-6 space-y-3 border border-outline">
                            <div className="flex items-center justify-between gap-2">
                              {renderStars(review.rating, 'text-base')}
                              <p className="text-xs text-on-surface-variant">{formatDate(review.writtenAt)}</p>
                            </div>
                            <p className="text-sm text-on-surface leading-relaxed break-words">
                              {review.content || '리뷰 내용이 없습니다.'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {getReviewLabelNames(review).map((label, index) => (
                                <span key={`${review.id}-label-${index}`} className="text-[11px] font-bold bg-white text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                                  {label}
                                </span>
                              ))}
                              <span className="text-xs text-on-surface-variant">{maskName(review.writerName) || (review.writerId ? `작성자 #${review.writerId}` : '작성자')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-on-surface-variant py-8">아직 리뷰가 없습니다. 첫 리뷰를 남겨주시면 큰 도움이 돼요! </p>
                    )}
                  </>
                )}
              </div>
            </section>

            {/* ── 모집중인 공고 섹션 ── */}
            <section className="py-16 bg-[#F8F9FA]">
              <div className="custom-container">
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight uppercase">모집 중인 공고</h2>
                    <p className="text-on-surface-variant text-sm mt-1">{companyName}에서 현재 모집 중인 공고입니다.</p>
                  </div>
                  {resolvedBrandId && (
                    <Link
                      to={`/brand/recruits?brandId=${resolvedBrandId}`}
                      className="text-primary font-bold text-sm hover:underline inline-flex items-center gap-1"
                    >
                      전체 공고 보기
                      <span className="material-symbols-outlined text-base">chevron_right</span>
                    </Link>
                  )}
                </div>

                {recruitsLoading && (
                  <p className="text-on-surface-variant py-8">공고를 불러오는 중입니다...</p>
                )}

                {!recruitsLoading && activeRecruits.length === 0 && (
                  <p className="text-on-surface-variant py-8">현재 모집 중인 공고가 없습니다.</p>
                )}

                {!recruitsLoading && activeRecruits.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {activeRecruits.map((recruit) => {
                      const isUrgent = recruit.isUrgent === true || recruit.isUrgent === 'true' || recruit.isUrgent === 'URGENT';
                      const salaryLabel = recruit.salaryType === 'MONTHLY' ? '월급' : '시급';
                      return (
                        <div
                          key={recruit.id}
                          className="bg-white rounded-xl border border-outline p-5 space-y-3 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate(`/recruit-detail?recruitId=${recruit.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            {isUrgent ? (
                              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">긴급 공고</span>
                            ) : (
                              <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded border border-outline">모집 중</span>
                            )}
                            <span className="material-symbols-outlined text-on-surface-variant text-base">
                              {isUrgent ? 'bolt' : 'calendar_month'}
                            </span>
                          </div>
                          <h3 className="font-bold text-base leading-snug">{recruit.title || '-'}</h3>
                          {recruit.deadline && (
                            <p className="text-xs text-on-surface-variant">{recruit.deadline}</p>
                          )}
                          <div className="pt-1 border-t border-outline">
                            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">급여</p>
                            <p className="font-black text-primary text-base mt-0.5">
                              {recruit.salary ? `₩${Number(recruit.salary).toLocaleString('ko-KR')} / ${salaryLabel === '시급' ? '시급' : '월급'}` : '-'}
                            </p>
                            {recruit.createdAt && (
                              <p className="text-xs text-on-surface-variant mt-1">{recruit.createdAt} 등록</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
      <AppFooter />

      <ReviewListModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        reviews={sortedReviews}
        title="근무 후기 전체 보기"
      />
    </>
  );
}

