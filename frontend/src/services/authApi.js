const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export function getStoredMember() {
    try {
        return JSON.parse(localStorage.getItem('member') || 'null');
    } catch (e) {
        return null;
    }
}

export async function requestWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');

    const finalUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

    const response = await fetch(finalUrl, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

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