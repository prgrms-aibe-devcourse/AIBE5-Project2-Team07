import React, { useEffect, useMemo, useState } from 'react';
import CommonButton from '../../CommonButton';
import { getStoredMember } from '../../../services/authApi';
import {
    getReviewsByTarget,
    getReviewsByWriter,
    createReview,
    updateReview,
    deleteReview,
} from '../../../services/reviewApi';
import { getReviewableApplies } from '../../../services/applyApi';
import {
    formatDate,
    normalizeReview,
    getReviewLabelNames,
} from '../../../utils/mypageUtils';
import StarRow from './StarRow';
import ReviewFormModal from './ReviewFormModal';

function resolveTargetInfoFromApply(account, apply) {
    if (account?.memberType === 'BUSINESS') {
        return {
            targetType: 'INDIVIDUAL',
            targetId: apply?.individualId || null,
        };
    }

    return {
        targetType: 'BUSINESS',
        targetId: apply?.businessMemberId || null,
    };
}

export default function ReviewContent({ account }) {
    const storedMember = getStoredMember();
    const memberId = account?.id || storedMember?.id || null;

    const [reviewTab, setReviewTab] = useState('received');
    const [receivedReviews, setReceivedReviews] = useState([]);
    const [writtenReviews, setWrittenReviews] = useState([]);

    const [reviewableApplies, setReviewableApplies] = useState([]);
    const [loadingReviewableApplies, setLoadingReviewableApplies] = useState(false);

    const [loadingReceived, setLoadingReceived] = useState(false);
    const [loadingWritten, setLoadingWritten] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [modalError, setModalError] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [formValue, setFormValue] = useState({
        reviewId: null,
        applyId: '',
        targetId: '',
        targetType: account?.memberType === 'BUSINESS' ? 'INDIVIDUAL' : 'BUSINESS',
        targetName: '',
        rating: 5,
        content: '',
        labelNames: [],
    });

    const targetIdForReceived = useMemo(() => memberId, [memberId]);

    const showMessage = (text) => {
        setMessage(text);

        setTimeout(() => {
            setMessage('');
        }, 2000);
    };

    const applyInfoMap = useMemo(() => {
        const map = new Map();

        reviewableApplies.forEach((apply) => {
            map.set(String(apply.id), {
                companyName: apply.companyName || '',
                recruitTitle: apply.recruitTitle || '',
                individualName: apply.individualName || '',
            });
        });

        return map;
    }, [reviewableApplies]);

    const getDisplayName = (review, tabType) => {
        const info = applyInfoMap.get(String(review.applyId));

        if (account?.memberType === 'BUSINESS') {
            if (tabType === 'received') {
                return (
                    review?.writerName ||
                    info?.individualName ||
                    review?.targetName ||
                    `회원 #${review.writerId || review.targetId}`
                );
            }

            return (
                info?.individualName ||
                review?.targetName ||
                `회원 #${review.targetId}`
            );
        }

        if (account?.memberType === 'INDIVIDUAL') {
            if (tabType === 'received') {
                return (
                    review?.writerCompanyName ||
                    review?.companyName ||
                    info?.companyName ||
                    `회사 #${review.writerId || review.targetId}`
                );
            }

            return (
                review?.targetCompanyName ||
                review?.companyName ||
                info?.companyName ||
                review?.targetName ||
                `회사 #${review.targetId}`
            );
        }

        return review?.writerName || review?.targetName || '알 수 없음';
    };

    const getDisplayRecruitTitle = (review) => {
        const info = applyInfoMap.get(String(review.applyId));
        return info?.recruitTitle || '';
    };

    const loadReceivedReviews = async () => {
        if (!targetIdForReceived) return;

        try {
            setLoadingReceived(true);
            setError('');
            const response = await getReviewsByTarget(targetIdForReceived);
            const list = Array.isArray(response) ? response.map(normalizeReview) : [];
            setReceivedReviews(list);
        } catch (err) {
            setError(err.message || '받은 리뷰를 불러오지 못했습니다.');
        } finally {
            setLoadingReceived(false);
        }
    };

    const loadWrittenReviews = async () => {
        if (!memberId) return;

        try {
            setLoadingWritten(true);
            setError('');
            const response = await getReviewsByWriter(memberId);
            const list = Array.isArray(response) ? response.map(normalizeReview) : [];
            setWrittenReviews(list);
        } catch (err) {
            setError(err.message || '작성한 리뷰를 불러오지 못했습니다.');
        } finally {
            setLoadingWritten(false);
        }
    };

    const loadReviewableApplies = async () => {
        if (!account) return;

        try {
            setLoadingReviewableApplies(true);
            setError('');

            const pageResponse = await getReviewableApplies(account);
            const content = Array.isArray(pageResponse?.content) ? pageResponse.content : [];

            setReviewableApplies(content);
        } catch (err) {
            console.error(err);
            setError(err.message || '리뷰 작성 가능한 완료된 지원 목록을 불러오지 못했습니다.');
        } finally {
            setLoadingReviewableApplies(false);
        }
    };

    useEffect(() => {
        if (!memberId) return;
        loadReceivedReviews();
        loadWrittenReviews();
    }, [memberId, targetIdForReceived]);

    useEffect(() => {
        if (account) {
            loadReviewableApplies();
        }
    }, [account]);

    const openCreateModal = () => {
        setModalMode('create');
        setModalError('');
        setFormValue({
            reviewId: null,
            applyId: '',
            targetId: '',
            targetType: account?.memberType === 'BUSINESS' ? 'INDIVIDUAL' : 'BUSINESS',
            targetName: '',
            rating: 5,
            content: '',
            labelNames: [],
        });
        setModalOpen(true);
    };

    const openEditModal = (review) => {
        setModalMode('edit');
        setModalError('');
        setFormValue({
            reviewId: review.id,
            applyId: String(review.applyId ?? ''),
            targetId: String(review.targetId ?? ''),
            targetType:
                review.targetType ??
                (account?.memberType === 'BUSINESS' ? 'INDIVIDUAL' : 'BUSINESS'),
            targetName: getDisplayName(review, 'written'),
            rating: Number(review.rating ?? 5),
            content: review.content ?? '',
            labelNames: getReviewLabelNames(review),
        });
        setModalOpen(true);
    };

    const handleCreateReview = async (form, selectedApply) => {
        try {
            setLoadingAction(true);
            setMessage('');
            setError('');
            setModalError('');

            if (!selectedApply) {
                setModalError('완료된 지원 건을 선택해주세요.');
                return;
            }

            const targetInfo = resolveTargetInfoFromApply(account, selectedApply);

            if (!targetInfo.targetId) {
                setModalError('선택한 지원 건의 리뷰 대상 정보가 없습니다.');
                return;
            }

            if (!form.content.trim()) {
                setModalError('리뷰 내용을 입력해주세요.');
                return;
            }

            if (!form.labelNames.length) {
                setModalError('리뷰 라벨을 1개 이상 선택해주세요.');
                return;
            }

            await createReview({
                applyId: Number(selectedApply.id),
                targetId: Number(targetInfo.targetId),
                targetType: targetInfo.targetType,
                rating: form.rating,
                content: form.content,
                labelNames: form.labelNames,
            });

            await loadWrittenReviews();
            await loadReceivedReviews();
            await loadReviewableApplies();

            showMessage('리뷰가 등록되었습니다.');
            setModalOpen(false);
        } catch (err) {
            setModalError(err.message || '리뷰 등록 중 오류가 발생했습니다.');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleUpdateReview = async (form) => {
        try {
            setLoadingAction(true);
            setMessage('');
            setError('');
            setModalError('');

            if (!form.reviewId) {
                setModalError('수정할 reviewId가 없습니다.');
                return;
            }

            if (!form.content.trim()) {
                setModalError('리뷰 내용을 입력해주세요.');
                return;
            }

            if (!form.labelNames.length) {
                setModalError('리뷰 라벨을 1개 이상 선택해주세요.');
                return;
            }

            await updateReview(form.reviewId, {
                rating: form.rating,
                content: form.content,
                labelNames: form.labelNames,
            });

            await loadWrittenReviews();
            await loadReceivedReviews();

            showMessage('리뷰가 수정되었습니다.');
            setModalOpen(false);
        } catch (err) {
            setModalError(err.message || '리뷰 수정 중 오류가 발생했습니다.');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        const ok = window.confirm('리뷰를 삭제하시겠습니까?');
        if (!ok) return;

        try {
            setLoadingAction(true);
            setMessage('');
            setError('');

            await deleteReview(reviewId);

            await loadWrittenReviews();
            await loadReceivedReviews();

            showMessage('리뷰가 삭제되었습니다.');
        } catch (err) {
            setError(err.message || '리뷰 삭제 중 오류가 발생했습니다.');
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <section className="flex-grow space-y-8">
            <header className="mb-8 space-y-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#1F1D1D]">리뷰 관리</h1>
                    <p className="text-[#6B6766] mt-1 text-sm">
                        {reviewTab === 'received' ? (
                            <>
                                총 <span className="text-primary font-bold">{receivedReviews.length}건</span>의 리뷰를 받았습니다.
                            </>
                        ) : (
                            <>
                                총 <span className="text-primary font-bold">{writtenReviews.length}건</span>의 리뷰를 작성했습니다.
                            </>
                        )}
                    </p>
                </div>

                <div className="flex justify-end min-h-[42px]">
                    {reviewTab === 'written' ? (
                        <button
                            onClick={openCreateModal}
                            className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#D61F44] transition-all shadow-md shadow-primary/10"
                        >
                            리뷰 작성
                        </button>
                    ) : (
                        <div className="h-[42px]" />
                    )}
                </div>
            </header>

            <div className="flex items-center justify-between border-b border-[#EAE5E3]">
                <div className="flex gap-2">
                    <CommonButton
                        onClick={() => setReviewTab('received')}
                        variant="toggle"
                        size="tab"
                        active={reviewTab === 'received'}
                        activeClassName="text-primary"
                        inactiveClassName="text-[#6B6766] hover:text-[#1F1D1D]"
                        className="relative rounded-none px-6"
                    >
                        내가 받은 리뷰
                        {reviewTab === 'received' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </CommonButton>

                    <CommonButton
                        onClick={() => setReviewTab('written')}
                        variant="toggle"
                        size="tab"
                        active={reviewTab === 'written'}
                        activeClassName="text-primary"
                        inactiveClassName="text-[#6B6766] hover:text-[#1F1D1D]"
                        className="relative rounded-none px-6"
                    >
                        내가 쓴 리뷰
                        {reviewTab === 'written' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </CommonButton>
                </div>

                <button className="bg-white border border-[#EAE5E3] px-4 py-2 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors mb-1">
                    최신순
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            {message && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm font-medium text-green-700">
                    {message}
                </div>
            )}

            {reviewTab === 'received' && (
                <>
                    {loadingReceived ? (
                        <div className="bg-white border border-[#EAE5E3] rounded-2xl p-8 text-sm text-[#6B6766] shadow-sm">
                            받은 리뷰를 불러오는 중...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {receivedReviews.length > 0 ? (
                                receivedReviews.map((review) => (
                                    <article
                                        key={review.id}
                                        className="bg-white border border-[#EAE5E3] p-6 rounded-2xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="w-full md:w-48 shrink-0">
                                                <h3 className="font-bold text-base text-[#1F1D1D] leading-tight mb-1">
                                                    {getDisplayName(review, 'received')}
                                                </h3>
                                                {getDisplayRecruitTitle(review) && (
                                                    <p className="text-xs text-[#6B6766] font-medium">
                                                        {getDisplayRecruitTitle(review)}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex-grow flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <StarRow rating={review.rating} />
                                                        <span className="text-[10px] text-[#6B6766] font-medium">
                                                            {formatDate(review.writtenAt)}
                                                        </span>
                                                    </div>

                                                    <h4 className="font-bold text-[#1F1D1D] mb-2 text-sm">
                                                        "{review.content || '리뷰 내용이 없습니다.'}"
                                                    </h4>

                                                    {getReviewLabelNames(review).length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            {getReviewLabelNames(review).map((label, idx) => (
                                                                <span
                                                                    key={`${label}-${idx}`}
                                                                    className="text-[11px] font-bold bg-[#FFF0F3] text-primary px-2.5 py-0.5 rounded-full"
                                                                >
                                                                    {label}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="bg-white border border-[#EAE5E3] rounded-2xl p-8 text-sm text-[#6B6766] shadow-sm">
                                    받은 리뷰가 없습니다.
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {reviewTab === 'written' && (
                <>
                    {loadingWritten ? (
                        <div className="bg-white border border-[#EAE5E3] rounded-2xl p-8 text-sm text-[#6B6766] shadow-sm">
                            작성한 리뷰를 불러오는 중...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {writtenReviews.length > 0 ? (
                                writtenReviews.map((review) => (
                                    <article
                                        key={review.id}
                                        className="bg-white border border-[#EAE5E3] p-6 rounded-2xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="w-full md:w-48 shrink-0">
                                                <h3 className="font-bold text-base text-[#1F1D1D] leading-tight mb-1">
                                                    {getDisplayName(review, 'written')}
                                                </h3>
                                                {getDisplayRecruitTitle(review) && (
                                                    <p className="text-xs text-[#6B6766] font-medium">
                                                        {getDisplayRecruitTitle(review)}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex-grow flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <StarRow rating={review.rating} />
                                                        <span className="text-[10px] text-[#6B6766] font-medium">
                                                            {formatDate(review.writtenAt)}
                                                        </span>
                                                    </div>

                                                    <h4 className="font-bold text-[#1F1D1D] mb-2 text-sm">
                                                        "{review.content || '리뷰 내용이 없습니다.'}"
                                                    </h4>

                                                    {getReviewLabelNames(review).length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            {getReviewLabelNames(review).map((label, idx) => (
                                                                <span
                                                                    key={`${label}-${idx}`}
                                                                    className="text-[11px] font-bold bg-[#FFF0F3] text-primary px-2.5 py-0.5 rounded-full"
                                                                >
                                                                    {label}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-6 flex gap-3 pt-4 border-t border-[#EAE5E3]/30">
                                                    <button
                                                        onClick={() => openEditModal(review)}
                                                        className="text-xs font-bold text-primary hover:underline"
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReview(review.id)}
                                                        className="text-xs font-bold text-[#6B6766]/70 hover:text-red-500 transition-colors"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="bg-white border border-[#EAE5E3] rounded-2xl p-8 text-sm text-[#6B6766] shadow-sm">
                                    작성한 리뷰가 없습니다.
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            <ReviewFormModal
                open={modalOpen}
                mode={modalMode}
                initialValue={formValue}
                loading={loadingAction || loadingReviewableApplies}
                onClose={() => {
                    setModalError('');
                    setModalOpen(false);
                }}
                reviewableApplies={reviewableApplies}
                accountMemberType={account?.memberType}
                error={modalError}
                onSubmit={(form, selectedApply) => {
                    if (modalMode === 'create') {
                        handleCreateReview(form, selectedApply);
                    } else {
                        handleUpdateReview(form);
                    }
                }}
            />
        </section>
    );
}