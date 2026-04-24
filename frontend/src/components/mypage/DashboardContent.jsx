import React, { useMemo } from 'react';
import CommonButton from '../CommonButton';
import {
    calculateProfileCompletion,
    formatDate,
    formatUpdatedLabel,
    getInitials,
} from '../../utils/mypageUtils';
import StarRow from './review/StarRow';

export default function DashboardContent({
                                             account,
                                             resume,
                                             loading,
                                             error,
                                             onMoveInfo,
                                             onMoveResume,
                                         }) {
    const profileCompletion = useMemo(() => {
        return calculateProfileCompletion(account, resume);
    }, [account, resume]);

    const memberName = account?.name || '회원';
    const memberImage = account?.image || '';
    const memberRole = account?.memberType === 'INDIVIDUAL' ? '개인회원' : '회원';

    const reviews = Array.isArray(resume?.reviews) ? resume.reviews : [];
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

                <div className="bg-[#FFF0F3] p-10 rounded-2xl border border-primary/10 relative overflow-hidden min-h-[260px] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
            <span
                className="material-symbols-outlined text-[120px] text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
            >
              notifications_active
            </span>
                    </div>

                    <div className="z-10">
                        <h3 className="text-sm text-primary font-bold uppercase tracking-wider mb-3">
                            긴급 매칭 현황
                        </h3>
                        <p className="text-3xl font-extrabold text-[#1F1D1D] tracking-tight leading-tight">
                            <span className="text-primary">0개</span>의 면접 요청
                            <br />
                            대기 중입니다.
                        </p>
                        <p className="text-xs text-[#6B6766] mt-4">
                            현재 이 값은 연결 가능한 API가 없어 임시 표시 중입니다.
                        </p>
                    </div>

                    <div className="mt-8 flex gap-3 z-10">
                        <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#D61F44] transition-all shadow-md shadow-primary/10">
                            요청 확인
                        </button>
                        <button className="bg-white text-[#1F1D1D] border border-[#EAE5E3] px-8 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
                            새 공고 찾기
                        </button>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-2xl border border-[#EAE5E3] shadow-sm min-h-[260px] flex flex-col justify-center items-center text-center">
                    <div className="text-5xl font-black text-primary mb-3">{profileCompletion}%</div>
                    <div className="text-sm font-bold text-[#6B6766] mb-6">프로필 완성도</div>
                    <div className="w-full bg-[#FFF0F3] h-3 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full rounded-full shadow-inner"
                            style={{ width: `${profileCompletion}%` }}
                        />
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
                    <button className="text-xs font-bold text-[#6B6766] hover:text-primary transition-colors">
                        전체 보기
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentReviews.length > 0 ? (
                        recentReviews.map((review, index) => {
                            const reviewerName = review.writerName || review.reviewerName || '리뷰 작성자';
                            const initials = getInitials(reviewerName);

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
                                        <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-primary text-[10px] flex items-center justify-center font-bold">
                                            {initials}
                                        </div>
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