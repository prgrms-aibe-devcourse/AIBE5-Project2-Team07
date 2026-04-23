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

export async function getMyBusinessAccountSummary() {
    return requestWithAuth('/business/account/summary', {
        method: 'GET',
    });
}

export async function getMyBusinessAccountMe() {
    return requestWithAuth('/business/account/me', {
        method: 'GET',
    });
}

export async function updateMyBusinessMemberAccount(payload) {
    return requestWithAuth('/business/account/edit/member', {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
}

export async function updateMyBusinessCompanyAccount(payload) {
    return requestWithAuth('/business/account/edit/company', {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
}

export async function updateMyBusinessPasswordAccount(payload) {
    return requestWithAuth('/business/account/edit/password', {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
}

export async function deleteMyBusinessAccount(payload) {
    return requestWithAuth('/business/account/delete', {
        method: 'DELETE',
        body: JSON.stringify(payload),
    });
}

