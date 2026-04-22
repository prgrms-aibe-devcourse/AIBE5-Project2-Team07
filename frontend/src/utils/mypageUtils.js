import { BUSINESS_TYPE_OPTIONS, BRAND_OPTIONS } from '../constants/mypageConstants';

export function calculateProfileCompletion(account, resume) {
    let total = 8;
    let score = 0;

    if (account?.name) score += 1;
    if (account?.phone) score += 1;
    if (account?.image) score += 1;
    if (resume?.title) score += 1;
    if (resume?.content) score += 1;
    if (Array.isArray(resume?.careers) && resume.careers.length > 0) score += 1;
    if (Array.isArray(resume?.educations) && resume.educations.length > 0) score += 1;
    if (Array.isArray(resume?.licenses) && resume.licenses.length > 0) score += 1;

    return Math.round((score / total) * 100);
}

export function formatDate(dateString) {
    if (!dateString) return '-';
    return String(dateString).slice(0, 10).replace(/-/g, '.');
}

export function formatUpdatedLabel(updatedAt) {
    if (!updatedAt) return '최근 수정: -';

    const updated = new Date(updatedAt);
    const now = new Date();
    const diffMs = now.getTime() - updated.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return '최근 수정: 오늘';
    if (diffDays === 1) return '최근 수정: 1일 전';
    if (diffDays < 30) return `최근 수정: ${diffDays}일 전`;

    const diffMonths = Math.floor(diffDays / 30);
    return `최근 수정: ${diffMonths}개월 전`;
}

export function getInitials(name) {
    if (!name) return 'ME';
    return String(name).slice(0, 2);
}

export function getBusinessTypeLabel(value) {
    const found = BUSINESS_TYPE_OPTIONS.find((item) => item.value === value);
    return found ? found.label : value;
}

export function getBrandById(brandId) {
    return BRAND_OPTIONS.find((brand) => brand.id === Number(brandId)) || null;
}

export function normalizeReview(review) {
    return {
        id: review?.id,
        writerId: review?.writerId,
        targetId: review?.targetId,
        targetType: review?.targetType,
        applyId: review?.applyId,
        rating: Number(review?.rating ?? 0),
        content: review?.content ?? '',
        writtenAt: review?.writtenAt ?? null,
        labels: Array.isArray(review?.labels) ? review.labels : [],
    };
}

export function getReviewLabelNames(review) {
    if (!Array.isArray(review?.labels)) return [];
    return review.labels
        .map((label) => label?.name ?? label?.labelName ?? '')
        .filter(Boolean);
}