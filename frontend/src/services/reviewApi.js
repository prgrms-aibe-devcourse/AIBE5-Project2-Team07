import { requestWithAuth } from './authApi';

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