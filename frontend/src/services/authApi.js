export function getToken() {
    return localStorage.getItem('token');
}

export function getStoredMember() {
    try {
        return JSON.parse(localStorage.getItem('member') || 'null');
    } catch (e) {
        return null;
    }
}

export function getAuthHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
}

export async function requestWithAuth(url, method = 'GET', body) {
    const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: body ? JSON.stringify(body) : undefined,
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