import { getStoredMember, requestWithAuth } from './authApi';

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

export async function getMyBusinessRecruits() {
    const storedMember = getStoredMember();
    const memberId = storedMember?.id || storedMember?.memberId;

    return requestWithAuth('/business/myrecruit', {
        method: 'GET',
        headers: {
            ...(memberId ? { 'X-Member-Id': String(memberId) } : {}),
        },
    });
}

export async function createMyBusinessRecruit(payload) {
    const storedMember = getStoredMember();
    const memberId = storedMember?.id || storedMember?.memberId;

    return requestWithAuth('/business/recruit/new', {
        method: 'POST',
        headers: {
            ...(memberId ? { 'X-Member-Id': String(memberId) } : {}),
        },
        body: JSON.stringify(payload),
    });
}

export async function updateMyBusinessRecruitStatus(recruitId, status) {
    const storedMember = getStoredMember();
    const memberId = storedMember?.id || storedMember?.memberId;

    return requestWithAuth(`/business/myrecruit/edit?recruitId=${encodeURIComponent(recruitId)}`, {
        method: 'PATCH',
        headers: {
            ...(memberId ? { 'X-Member-Id': String(memberId) } : {}),
        },
        body: JSON.stringify({ status }),
    });
}

export async function deleteMyBusinessRecruit(recruitId) {
    const storedMember = getStoredMember();
    const memberId = storedMember?.id || storedMember?.memberId;

    return requestWithAuth(`/business/myrecruit/delete?recruitId=${encodeURIComponent(recruitId)}`, {
        method: 'DELETE',
        headers: {
            ...(memberId ? { 'X-Member-Id': String(memberId) } : {}),
        },
    });
}

