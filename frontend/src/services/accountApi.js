import { requestWithAuth } from './authApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function getMyAccount() {
    return requestWithAuth(`${API_BASE}/personal/account`, 'GET');
}

export async function updateMyAccount(payload) {
    return requestWithAuth(`${API_BASE}/personal/account`, 'PATCH', payload);
}

export async function deleteMyAccount() {
    return requestWithAuth(`${API_BASE}/personal/account`, 'DELETE');
}