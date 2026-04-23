import { requestWithAuth } from './authApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function getReviewsByWriter(writerId) {
    return requestWithAuth(`${API_BASE}/reviews/writer/${writerId}`, 'GET');
}

export async function getReviewsByTarget(targetId) {
    return requestWithAuth(`${API_BASE}/reviews/target/${targetId}`, 'GET');
}

export async function createReview(payload) {
    return requestWithAuth(`${API_BASE}/reviews`, 'POST', payload);
}

export async function updateReview(reviewId, payload) {
    return requestWithAuth(`${API_BASE}/reviews/${reviewId}`, 'PATCH', payload);
}

export async function deleteReview(reviewId) {
    return requestWithAuth(`${API_BASE}/reviews/${reviewId}`, 'DELETE');
}