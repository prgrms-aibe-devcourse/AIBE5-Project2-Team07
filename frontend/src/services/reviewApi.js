import { requestWithAuth } from './authApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function requestPublic(url) {
    const response = await fetch(url);

    let result = null;
    try {
        result = await response.json();
    } catch (e) {
        result = null;
    }

    if (!response.ok) {
        throw new Error(result?.error || result?.message || '요청 처리 중 오류가 발생했습니다.');
    }

    return result;
}

export async function getReviewsByTarget(targetId) {
    return requestWithAuth(`/reviews/target/${targetId}`, {
        method: 'GET',
    });
}

export async function getReviewsByWriter(writerId) {
    return requestWithAuth(`/reviews/writer/${writerId}`, {
        method: 'GET',
    });
}

export async function createReview(payload) {
    return requestWithAuth('/reviews', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function updateReview(reviewId, payload) {
    return requestWithAuth(`/reviews/${reviewId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
}

export async function deleteReview(reviewId) {
    return requestWithAuth(`/reviews/${reviewId}`, {
        method: 'DELETE',
    });
}

export async function getPublicReviewsByTarget(targetId) {
    return requestPublic(`${API_BASE}/reviews/target/${targetId}`);
}
