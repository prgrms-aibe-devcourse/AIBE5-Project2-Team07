import React, { useEffect, useState } from 'react';
import { getMyApplications, getMyOffers } from '../../services/applyApi';
import { getReviewsByTarget } from '../../services/reviewApi.js';
import CommonButton from '../CommonButton';
import {
    formatDate,
    formatUpdatedLabel,
    normalizeReview
} from '../../utils/mypageUtils';
import StarRow from './review/StarRow';

export default function DashboardContent({
                                             account,
                                             resume,
                                             loading,
                                             error,
                                             onMoveInfo,
                                             onMoveResume,
                                             onMoveStatusTab,
                                             onFindRecruit,
                                             onMoveReview,
                                         }) {
    const [requestSummary, setRequestSummary] = useState({ applications: 0, offers: 0 });
    const getTotalCount = (response) => {
        if (Number.isFinite(Number(response?.totalElements))) {
            return Number(response.totalElements);
        }
        if (Array.isArray(response?.content)) {
            return response.content.length;
        }
        return 0;
    };
    const getReviewerDisplayName = (review) => {
        if (account?.memberType === 'INDIVIDUAL') {
            return (
                review.writerCompanyName ||
                review.companyName ||
                review.businessName ||
                review.writerBusinessName ||
                review.writerName ||
                review.reviewerName ||
                '리뷰 작성자'
            );
        }

        return (
            review.writerName ||
            review.reviewerName ||
            review.individualName ||
            '리뷰 작성자'
        );
    };
    const memberName = account?.name || '회원';
    const memberImage = account?.image || '';
    const memberRole = account?.memberType === 'INDIVIDUAL' ? '개인회원' : '회원';
    const [dashboardReviews, setDashboardReviews] = useState([]);

    useEffect(() => {
        const memberId = account?.id;

        if (!memberId || account?.memberType !== 'INDIVIDUAL') {
            setRequestSummary({ applications: 0, offers: 0 });
            return;
        }

        let mounted = true;

        const loadRequestSummary = async () => {
            try {
                const [applicationsResponse, offersResponse] = await Promise.all([
                    getMyApplications(memberId, 0, 1),
                    getMyOffers(memberId, { page: 0, size: 1 }),
                ]);

                if (!mounted) return;

                setRequestSummary({
                    applications: getTotalCount(applicationsResponse),
                    offers: getTotalCount(offersResponse),
                });
            } catch (err) {
                console.error('대시보드 지원/제의 건수 조회 실패:', err);
                if (mounted) {
                    setRequestSummary({ applications: 0, offers: 0 });
                }
            }
        };

        loadRequestSummary();

        return () => {
            mounted = false;
        };
    }, [account?.id, account?.memberType]);

    useEffect(() => {
        const loadDashboardReviews = async () => {
            const memberId = account?.id || resume?.memberId;

            if (!memberId) {
                setDashboardReviews([]);
                return;
            }

            try {
                const response = await getReviewsByTarget(memberId);
                const list = Array.isArray(response)
                    ? response.map(normalizeReview)
                    : [];

                setDashboardReviews(list);
            } catch (err) {
                console.error('대시보드 최근 리뷰 조회 실패:', err);
                setDashboardReviews([]);
            }
        };

        loadDashboardReviews();
    }, [account?.id, resume?.memberId]);

    const reviews = dashboardReviews.length > 0
        ? dashboardReviews
        : Array.isArray(resume?.reviews)
            ? resume.reviews
            : [];

    const recentReviews = reviews.slice(0, 2);

    return (
        <section className="w-full space-y-8">
            {loading && (
                <div className="bg-white rounded-2xl border border-[#EAE5E3] p-8 text-sm font-medium text-[#6B6766] shadow-sm">
                    마이페이지 정보를 불러오는 중...
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_280px] gap-6 items-stretch">
                <div className="bg-white p-8 rounded-2xl border border-[#EAE5E3] shadow-sm min-h-[260px] flex flex-col justify-center">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-[#FFF0F3] shadow-inner bg-gray-100 flex items-center justify-center">
                            {memberImage ? (
                                <img src={memberImage} alt={memberName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-outlined text-[#6B6766] text-6xl">person</span>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-[#1F1D1D]">{memberName}</h2>
                        <p className="text-base font-medium text-[#6B6766]">{memberRole}</p>

                        <CommonButton
                            onClick={onMoveInfo}
                            variant="subtle"
                            size="sm"
                            fullWidth
                            className="mt-6 text-sm border border-[#EAE5E3]"
                        >
                            프로필 수정
                        </CommonButton>
                    </div>
                </div>

                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[260px]">
                    <div className="bg-[#FFF0F3] p-8 rounded-2xl border border-primary/10 relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                            <span
                                className="material-symbols-outlined text-[110px] text-primary"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                assignment
                            </span>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-sm text-primary font-bold uppercase tracking-wider mb-3">
                                내가 한 지원
                            </h3>
                            <p className="text-3xl font-extrabold text-[#1F1D1D] tracking-tight leading-tight">
                                <span className="text-primary">{requestSummary.applications}건</span>
                                <br />
                                지원했어요.
                            </p>
                            <p className="text-xs text-[#6B6766] mt-4">
                                지원 현황을 확인하세요.
                            </p>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3 relative z-10">
                            <button
                                type="button"
                                onClick={() => onMoveStatusTab?.('applications')}
                                className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#D61F44] transition-all shadow-md shadow-primary/10"
                            >
                                지원 확인
                            </button>
                            <button
                                type="button"
                                onClick={onFindRecruit}
                                className="bg-white text-[#1F1D1D] border border-[#EAE5E3] px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
                            >
                                새 공고 찾기
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-[#EAE5E3] shadow-sm relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                            <span
                                className="material-symbols-outlined text-[110px] text-primary"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                mail
                            </span>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-sm text-primary font-bold uppercase tracking-wider mb-3">
                                내가 받은 제의
                            </h3>
                            <p className="text-3xl font-extrabold text-[#1F1D1D] tracking-tight leading-tight">
                                <span className="text-primary">{requestSummary.offers}건</span>
                                <br />
                                도착했어요.
                            </p>
                            <p className="text-xs text-[#6B6766] mt-4">
                                받은 제의를 확인하고 수락 또는 거절을 진행하세요.
                            </p>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3 relative z-10">
                            <button
                                type="button"
                                onClick={() => onMoveStatusTab?.('offers')}
                                className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#D61F44] transition-all shadow-md shadow-primary/10"
                            >
                                제의 확인
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">활성 이력서</h3>
                    <button
                        onClick={onMoveResume}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                        전체 관리
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </button>
                </div>

                <div className="space-y-3">
                    {resume ? (
                        <div
                            className="bg-white border border-[#EAE5E3] rounded-2xl p-5 hover:border-primary/30 transition-all group shadow-sm flex items-center justify-between cursor-pointer"
                            onClick={onMoveResume}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#FFF0F3] rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">article</span>
                                </div>
                                <div>
                                    <h4 className="font-bold group-hover:text-primary transition-colors">
                                        {resume.title || '이력서 제목 없음'}
                                    </h4>
                                    <p className="text-xs text-[#6B6766] mt-0.5">
                                        {formatUpdatedLabel(resume.updatedAt)}
                                    </p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-[#EAE5E3] group-hover:text-primary transition-colors">
                chevron_right
              </span>
                        </div>
                    ) : (
                        <div className="bg-white border border-[#EAE5E3] rounded-2xl p-6 text-sm text-[#6B6766] shadow-sm">
                            <p>등록된 이력서가 없습니다.</p>
                            <button
                                onClick={onMoveResume}
                                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold"
                            >
                                이력서 작성하기
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">최근 리뷰</h3>
                    <button
                        onClick={onMoveReview}
                        className="text-xs font-bold text-primary hover:underline transition-colors flex items-center gap-1"
                    >
                        더보기
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentReviews.length > 0 ? (
                        recentReviews.map((review, index) => {
                            const reviewerName = getReviewerDisplayName(review);

                            return (
                                <div
                                    key={review.id || index}
                                    className="bg-white border border-[#EAE5E3] rounded-2xl p-6 flex flex-col justify-between hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <StarRow rating={review.rating} />
                                            <span className="text-[10px] text-[#6B6766] font-medium">
                        {formatDate(review.writtenAt || review.createdAt || review.writtenDate)}
                      </span>
                                        </div>

                                        <p className="text-sm font-semibold leading-relaxed text-[#1F1D1D] tracking-tight mb-6">
                                            "{review.content || '리뷰 내용이 없습니다.'}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-[#EAE5E3]/30">
                                        <div>
                                            <p className="text-xs font-bold text-[#1F1D1D]">{reviewerName}</p>
                                            <p className="text-[10px] text-[#6B6766] font-medium">
                                                평점 {Number(review.rating || 0).toFixed(1)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="md:col-span-2 bg-white border border-[#EAE5E3] rounded-2xl p-6 text-sm text-[#6B6766] shadow-sm">
                            등록된 리뷰가 없습니다.
                        </div>
                    )}
                </div>
            </section>
        </section>
    );
}