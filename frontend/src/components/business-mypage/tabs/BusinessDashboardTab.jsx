import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBusinessRecruits } from '../../../services/accountApi';
import { getStoredMember } from '../../../services/authApi';
import { getReviewsByTarget } from '../../../services/reviewApi';

function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 10).replace(/-/g, '.');
    return date.toLocaleDateString('ko-KR');
}

function formatRelative(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return formatDate(value);

    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;

    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;

    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}일 전`;
}

function renderStars(rating) {
    const score = Math.max(0, Math.min(5, Number(rating) || 0));
    const full = Math.floor(score);
    const half = score - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
        <div className="flex gap-0.5">
            {Array(full).fill(0).map((_, idx) => (
                <span
                    key={`f-${idx}`}
                    className="material-symbols-outlined text-primary text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                >
                    star
                </span>
            ))}
            {half && (
                <span
                    className="material-symbols-outlined text-primary text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                >
                    star_half
                </span>
            )}
            {Array(empty).fill(0).map((_, idx) => (
                <span key={`e-${idx}`} className="material-symbols-outlined text-gray-200 text-[16px]">
                    star
                </span>
            ))}
        </div>
    );
}

export default function BusinessDashboardTab() {
    const navigate = useNavigate();
    const member = getStoredMember();
    const businessMemberId = member?.id ?? member?.memberId ?? null;

    const [recruits, setRecruits] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const loadDashboardData = async () => {
            try {
                setLoading(true);
                setError('');

                const [recruitResult, reviewResult] = await Promise.all([
                    getMyBusinessRecruits(),
                    businessMemberId ? getReviewsByTarget(businessMemberId) : Promise.resolve([]),
                ]);

                if (!mounted) return;

                setRecruits(Array.isArray(recruitResult) ? recruitResult : []);
                setReviews(Array.isArray(reviewResult) ? reviewResult : []);
            } catch (loadError) {
                if (!mounted) return;
                setRecruits([]);
                setReviews([]);
                setError(loadError?.message || '대시보드 정보를 불러오지 못했습니다.');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadDashboardData();

        return () => {
            mounted = false;
        };
    }, [businessMemberId]);

    const activeRecruitCount = useMemo(() => (
        recruits.filter((item) => String(item?.status || '').toUpperCase() === 'OPEN').length
    ), [recruits]);

    const avgRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + (Number(review?.rating) || 0), 0);
        return sum / reviews.length;
    }, [reviews]);

    const recentRecruits = useMemo(() => {
        return [...recruits]
            .sort((a, b) => {
                const dateA = new Date(a?.createdAt || 0).getTime();
                const dateB = new Date(b?.createdAt || 0).getTime();
                if (dateA !== dateB) return dateB - dateA;
                return Number(b?.id || 0) - Number(a?.id || 0);
            })
            .slice(0, 5);
    }, [recruits]);

    const recentReviews = useMemo(() => {
        return [...reviews]
            .sort((a, b) => {
                const dateA = new Date(a?.writtenAt || a?.createdAt || 0).getTime();
                const dateB = new Date(b?.writtenAt || b?.createdAt || 0).getTime();
                return dateB - dateA;
            })
            .slice(0, 2);
    }, [reviews]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white border border-outline rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">bolt</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-on-surface-variant mb-0.5">활성 공고</p>
                        <p className="text-xl font-black">
                            {String(activeRecruitCount).padStart(2, '0')} <span className="text-sm font-medium text-on-surface-variant">건</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-outline rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                        <span
                            className="material-symbols-outlined text-yellow-500"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            star
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-on-surface-variant mb-0.5">평균 평점</p>
                        <p className="text-xl font-black">
                            {avgRating.toFixed(1)} <span className="text-sm font-medium text-on-surface-variant">/ 5.0</span>
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">공고 관리</h3>
                    <button
                        type="button"
                        className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
                        onClick={() => navigate('/dashboard?tab=recruits')}
                    >
                        더보기
                    </button>
                </div>

                {loading ? (
                    <div className="bg-white border border-outline rounded-2xl p-6 text-sm text-on-surface-variant">
                        공고를 불러오는 중입니다...
                    </div>
                ) : recentRecruits.length === 0 ? (
                    <div className="bg-white border border-outline rounded-2xl p-6 text-sm text-on-surface-variant">
                        등록된 공고가 없습니다.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentRecruits.map((item) => {
                            const isUrgent = Boolean(item?.isUrgent ?? item?.urgent);
                            const isOpen = String(item?.status || '').toUpperCase() === 'OPEN';

                            return (
                                <div key={item?.id} className="bg-white border border-outline rounded-2xl p-5 hover:border-primary/30 transition-all group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {isUrgent && (
                                                    <span className="text-[10px] font-bold text-primary bg-primary-soft px-1.5 py-0.5 rounded">
                                                        긴급
                                                    </span>
                                                )}
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                                    isOpen
                                                        ? 'text-primary border-primary/30 bg-primary-soft'
                                                        : 'text-on-surface-variant border-outline bg-gray-50'
                                                }`}>
                                                    {isOpen ? '모집 중' : '마감'}
                                                </span>
                                            </div>
                                            <h4 className="font-bold group-hover:text-primary transition-colors truncate" title={item?.title || '-'}>
                                                {item?.title || '-'}
                                            </h4>
                                            <p className="text-xs text-on-surface-variant mt-0.5 truncate" title={`${item?.regionName || '-'} • ${formatDate(item?.deadline)}`}>
                                                {item?.regionName || '-'} • 마감 {formatDate(item?.deadline)}
                                            </p>
                                        </div>
                                        <p className="text-xs text-on-surface-variant shrink-0">
                                            {formatRelative(item?.createdAt)} 등록
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">최근 리뷰</h3>
                    <button
                        type="button"
                        className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
                        onClick={() => navigate('/dashboard?tab=reviews')}
                    >
                        더보기
                    </button>
                </div>

                {loading ? (
                    <div className="bg-white border border-outline rounded-2xl p-6 text-sm text-on-surface-variant">
                        리뷰를 불러오는 중입니다...
                    </div>
                ) : recentReviews.length === 0 ? (
                    <div className="bg-white border border-outline rounded-2xl p-6 text-sm text-on-surface-variant">
                        최근 리뷰가 없습니다.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentReviews.map((review) => (
                            <div key={review?.id || `${review?.writtenAt}-${review?.content}`} className="bg-white border border-outline rounded-2xl p-6">
                                <div className="flex justify-between items-start mb-4">
                                    {renderStars(review?.rating)}
                                    <span className="text-[10px] text-on-surface-variant font-medium">
                                        {formatDate(review?.writtenAt || review?.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm font-semibold leading-relaxed mb-4 line-clamp-3">
                                    "{review?.content || '리뷰 내용이 없습니다.'}"
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-bold text-on-surface-variant truncate" title={review?.writerName || '작성자'}>
                                        {review?.writerName || '작성자'}
                                    </span>
                                    <span className="text-[11px] text-on-surface-variant">
                                        평점 {Number(review?.rating || 0).toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}