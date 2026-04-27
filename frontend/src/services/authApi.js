const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function getToken() {
    return localStorage.getItem('token');
}

export function getStoredMember() {
    try {
        return JSON.parse(localStorage.getItem('member') || 'null');
    } catch {
        return null;
    }
}

export function getAuthHeaders() {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

export async function requestWithAuth(url, options = {}) {
    const finalUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

    const fetchOptions = {
        method: options.method || 'GET',
        credentials: options.credentials || 'include',
        headers: {
            ...getAuthHeaders(),
            ...(options.headers || {}),
        },
    };

    if (options.body !== undefined) {
        fetchOptions.body =
            typeof options.body === 'string'
                ? options.body
                : JSON.stringify(options.body);
    }

    const response = await fetch(finalUrl, fetchOptions);

    let result = null;
    try {
        result = await response.json();
    } catch {
        result = null;
    }

    if (!response.ok) {
        throw new Error(
            result?.error || result?.message || '요청 처리 중 오류가 발생했습니다.'
        );
    }

    return result;
}