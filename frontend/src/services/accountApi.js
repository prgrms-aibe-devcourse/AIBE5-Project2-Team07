import { requestWithAuth } from './authApi';

export async function getMyAccount() {
    return requestWithAuth('/personal/account', {
        method: 'GET',
    });
}

export async function updateMyAccount(payload) {
    return requestWithAuth('/personal/account', {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
}

export async function deleteMyAccount() {
    return requestWithAuth('/personal/account', {
        method: 'DELETE',
    });
}