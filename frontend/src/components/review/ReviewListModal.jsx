import React from 'react';
import { formatDate, getReviewLabelNames } from '../../utils/mypageUtils';

function parseDateToTime(value) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function renderStars(rating) {
  const safeRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return (
    <div className="flex items-center gap-0.5 text-primary">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={`star-${index}`}
          className="material-symbols-outlined text-base"
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

export default function ReviewListModal({ open, onClose, reviews, title = '근무 후기 전체 보기' }) {
  if (!open) return null;

  const sortedReviews = [...(Array.isArray(reviews) ? reviews : [])].sort((a, b) => {
    const diff = parseDateToTime(b?.writtenAt) - parseDateToTime(a?.writtenAt);
    if (diff !== 0) return diff;
    return Number(b?.id || 0) - Number(a?.id || 0);
  });

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-on-surface/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-outline flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-outline flex items-center justify-between">
          <h4 className="text-lg font-bold text-on-surface">{title}</h4>
          <button
            type="button"
            className="text-on-surface-variant hover:text-on-surface transition-colors"
            onClick={onClose}
            aria-label="리뷰 모달 닫기"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 bg-surface-container-low/40">
          {sortedReviews.length === 0 && (
            <div className="rounded-xl border border-outline bg-white p-6 text-sm text-on-surface-variant">
              등록된 리뷰가 없습니다.
            </div>
          )}

          {sortedReviews.map((review) => (
            <article key={review.id} className="rounded-xl border border-outline bg-white p-5">
              <div className="flex items-center justify-between gap-3 mb-2">
                {renderStars(review?.rating)}
                <span className="text-xs text-on-surface-variant">{formatDate(review?.writtenAt)}</span>
              </div>
              <p className="text-sm text-on-surface leading-relaxed break-words">
                {review?.content || '리뷰 내용이 없습니다.'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {getReviewLabelNames(review).map((label, index) => (
                  <span key={`${review.id}-label-${index}`} className="text-[11px] font-bold bg-[#FFF0F3] text-primary px-2.5 py-0.5 rounded-full">
                    {label}
                  </span>
                ))}
                <span className="text-[11px] text-on-surface-variant">{maskName(review?.writerName) || (review?.writerId ? `작성자 #${review.writerId}` : '작성자')}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

