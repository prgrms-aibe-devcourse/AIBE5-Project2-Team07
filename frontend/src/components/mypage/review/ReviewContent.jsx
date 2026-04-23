import React, { useEffect, useState } from 'react';
import CommonButton from '../../CommonButton';
import { getStoredMember } from '../../../services/authApi';
import {
    getReviewsByTarget,
    getReviewsByWriter,
    createReview,
    updateReview,
    deleteReview,
} from '../../../services/reviewApi';
import { formatDate, normalizeReview, getReviewLabelNames } from '../../../utils/mypageUtils';
import StarRow from './StarRow';
import ReviewFormModal from './ReviewFormModal';

export default function ReviewContent({ account }) {
    const storedMember = getStoredMember();
    const memberId = account?.id || storedMember?.id || null;
    const targetId = memberId;

    const [reviewTab, setReviewTab] = useState('received');
    const [receivedReviews, setReceivedReviews] = useState([]);
    const [writtenReviews, setWrittenReviews] = useState([]);

    const [loadingReceived, setLoadingReceived] = useState(false);
    const [loadingWritten, setLoadingWritten] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [formValue, setFormValue] = useState({
        reviewId: null,
        applyId: '',
        targetId: '',
        targetType: 'BUSINESS',
        rating: 5,
        content: '',
        labelNames: [],
    });

    const loadReceivedReviews = async () => {
        if (!targetId) return;

        try {
            setLoadingReceived(true);
            setError('');
            const response = await getReviewsByTarget(targetId);
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

    useEffect(() => {
        if (!memberId) return;
        loadReceivedReviews();
        loadWrittenReviews();
    }, [memberId]);

    const openCreateModal = () => {
        setModalMode('create');
        setFormValue({
            reviewId: null,
            applyId: '',
            targetId: '',
            targetType: 'BUSINESS',
            rating: 5,
            content: '',
            labelNames: [],
        });
        setModalOpen(true);
    };

    const openEditModal = (review) => {
        setModalMode('edit');
        setFormValue({
            reviewId: review.id,
            applyId: String(review.applyId ?? ''),
            targetId: String(review.targetId ?? ''),
            targetType: review.targetType ?? 'BUSINESS',
            rating: Number(review.rating ?? 5),
            content: review.content ?? '',
            labelNames: getReviewLabelNames(review),
        });
        setModalOpen(true);
    };

    const handleCreateReview = async (form) => {
        try {
            setLoadingAction(true);
            setMessage('');
            setError('');

            if (!form.applyId.trim()) throw new Error('applyId를 입력해주세요.');
            if (!form.targetId.trim()) throw new Error('targetId를 입력해주세요.');
            if (!form.content.trim()) throw new Error('리뷰 내용을 입력해주세요.');
            if (!form.labelNames.length) throw new Error('리뷰 라벨을 1개 이상 선택해주세요.');

            await createReview({
                applyId: Number(form.applyId),
                targetId: Number(form.targetId),
                targetType: form.targetType,
                rating: form.rating,
                content: form.content,
                labelNames: form.labelNames,
            });

            await loadWrittenReviews();
            await loadReceivedReviews();

            setMessage('리뷰가 등록되었습니다.');
            setModalOpen(false);
        } catch (err) {
            setError(err.message || '리뷰 등록 중 오류가 발생했습니다.');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleUpdateReview = async (form) => {
        try {
            setLoadingAction(true);
            setMessage('');
            setError('');

            if (!form.reviewId) throw new Error('수정할 reviewId가 없습니다.');
            if (!form.content.trim()) throw new Error('리뷰 내용을 입력해주세요.');
            if (!form.labelNames.length) throw new Error('리뷰 라벨을 1개 이상 선택해주세요.');

            await updateReview(form.reviewId, {
                rating: form.rating,
                content: form.content,
                labelNames: form.labelNames,
            });

            await loadWrittenReviews();
            await loadReceivedReviews();

            setMessage('리뷰가 수정되었습니다.');
            setModalOpen(false);
        } catch (err) {
            setError(err.message || '리뷰 수정 중 오류가 발생했습니다.');
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

            setMessage('리뷰가 삭제되었습니다.');
        } catch (err) {
            setError(err.message || '리뷰 삭제 중 오류가 발생했습니다.');
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <section className="flex-grow space-y-8">
            <header className="flex items-end justify-between mb-6">
                <div>
                    <h1 className="font-bold text-2xl tracking-tight text-[#1F1D1D] mb-1">리뷰 관리</h1>
                    <p className="text-[#6B6766] text-sm font-medium">
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

                {reviewTab === 'written' && (
                    <button
                        onClick={openCreateModal}
                        className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#D61F44] transition-all shadow-md shadow-primary/10"
                    >
                        리뷰 작성
                    </button>
                )}
            </header>

            <div className="flex gap-2 border-b border-[#EAE5E3]">
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
                    <div className="flex items-end justify-between mb-2">
                        <div />
                        <div className="flex gap-2">
                            <button className="bg-white border border-[#EAE5E3] px-4 py-2 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">
                                최신순
                            </button>
                        </div>
                    </div>

                    {loadingReceived ? (
                        <div className="bg-white border border-[#EAE5E3] rounded-2xl p-8 text-sm text-[#6B6766] shadow-sm">
                            받은 리뷰를 불러오는 중...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {receivedReviews.length > 0 ? (
                                receivedReviews.map((review) => {
                                    const reviewerName =
                                        review.writerName || review.reviewerName || `작성자 #${review.writerId}`;

                                    return (
                                        <article
                                            key={review.id}
                                            className="bg-white border border-[#EAE5E3] p-6 rounded-2xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="w-full md:w-48 shrink-0">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-xl border border-[#EAE5E3]/50 mb-4 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[#6B6766] text-3xl">person</span>
                                                    </div>
                                                    <h3 className="font-bold text-base text-[#1F1D1D] leading-tight mb-1">
                                                        {reviewerName}
                                                    </h3>
                                                    <p className="text-xs font-medium text-[#6B6766] mb-3">
                                                        writerId: {review.writerId}
                                                    </p>
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
                                    );
                                })
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
                    <div className="flex items-end justify-between mb-2">
                        <div />
                        <div className="flex gap-2">
                            <button className="bg-white border border-[#EAE5E3] px-4 py-2 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">
                                최신순
                            </button>
                        </div>
                    </div>

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
                                                <div className="w-16 h-16 bg-gray-50 rounded-xl border border-[#EAE5E3]/50 mb-4 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#6B6766] text-3xl">
                            {review.targetType === 'BUSINESS' ? 'store' : 'person'}
                          </span>
                                                </div>
                                                <h3 className="font-bold text-base text-[#1F1D1D] leading-tight mb-1">
                                                    targetId: {review.targetId}
                                                </h3>
                                                <p className="text-xs font-medium text-[#6B6766] mb-3">
                                                    {review.targetType}
                                                </p>
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
                loading={loadingAction}
                onClose={() => setModalOpen(false)}
                onSubmit={(form) => {
                    if (modalMode === 'create') {
                        handleCreateReview(form);
                    } else {
                        handleUpdateReview(form);
                    }
                }}
            />
        </section>
    );
}