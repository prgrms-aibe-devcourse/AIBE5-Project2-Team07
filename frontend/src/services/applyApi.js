import { requestWithAuth, getStoredMember } from './authApi';

function resolveBusinessProfileId() {
    const storedMember = getStoredMember();
    return (
        storedMember?.businessProfileId ||
        storedMember?.businessProfile?.id ||
        storedMember?.profileId ||
        ''
    );
}

async function getBusinessApplyPage(path, params = {}, defaultErrorMessage = '목록을 불러오는 중 오류가 발생했습니다.') {
    const businessProfileId = resolveBusinessProfileId();
    const {
        page = 0,
        size = 20,
        type,
        recruitId,
    } = params;

    const searchParams = new URLSearchParams();
    searchParams.set('page', String(page));
    searchParams.set('size', String(size));
    if (type) searchParams.set('type', String(type));
    if (recruitId) searchParams.set('recruitId', String(recruitId));

    try {
        return await requestWithAuth(`${path}?${searchParams.toString()}`, {
            method: 'GET',
            headers: {
                'X-Business-Profile-Id': String(businessProfileId),
            },
        });
    } catch (error) {
        throw new Error(error?.message || defaultErrorMessage);
    }
}

export async function getBusinessApplications(params = {}) {
    return getBusinessApplyPage(
        '/applies/business/applications',
        params,
        '지원 목록을 불러오는 중 오류가 발생했습니다.',
    );
}

export async function getBusinessOffers(params = {}) {
    return getBusinessApplyPage(
        '/applies/business/offers',
        params,
        '제의 목록을 불러오는 중 오류가 발생했습니다.',
    );
}

export async function getBusinessWorks(params = {}) {
    return getBusinessApplyPage(
        '/applies/business/works',
        params,
        '근무 목록을 불러오는 중 오류가 발생했습니다.',
    );
}

export async function getBusinessCompletedWorks(params = {}) {
    return getBusinessApplyPage(
        '/applies/business/reviews',
        params,
        '근무 완료 목록을 불러오는 중 오류가 발생했습니다.',
    );
}

export async function decideBusinessApplication(applyId, accept) {
    const businessProfileId = resolveBusinessProfileId();

    return requestWithAuth(`/applies/${encodeURIComponent(applyId)}/decision`, {
        method: 'PATCH',
        headers: {
            'X-Business-Profile-Id': String(businessProfileId),
        },
        body: JSON.stringify({ accept: Boolean(accept) }),
    });
}

export async function cancelBusinessApply(applyId) {
    const businessProfileId = resolveBusinessProfileId();
    return requestWithAuth(`/applies/${encodeURIComponent(applyId)}`, {
        method: 'DELETE',
        headers: {
            'X-Business-Profile-Id': String(businessProfileId),
        },
    });
}

export async function completeBusinessApply(applyId) {
    const businessProfileId = resolveBusinessProfileId();
    return requestWithAuth(`/applies/${encodeURIComponent(applyId)}/complete`, {
        method: 'PATCH',
        headers: {
            'X-Business-Profile-Id': String(businessProfileId),
        },
    });
}

export async function offerToIndividualByBusiness(payload) {
    const businessProfileId = resolveBusinessProfileId();

    return requestWithAuth('/applies/offer', {
        method: 'POST',
        headers: {
            'X-Business-Profile-Id': String(businessProfileId),
        },
        body: payload,
    });
}

export async function offerToIndividualByBusinessAndMemberId(payload) {
    const businessProfileId = resolveBusinessProfileId();

    return requestWithAuth('/applies/offer/by-member', {
        method: 'POST',
        headers: {
            'X-Business-Profile-Id': String(businessProfileId),
        },
        body: payload,
    });
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function resolveMemberId(memberId) {
    if (memberId != null) return memberId;
    const storedMember = getStoredMember();
    return storedMember?.id ?? null;
}

function buildPagingQuery(params = {}) {
    const { page = 0, size = 20, type } = params;
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    if (type) query.set('type', String(type));
    return query;
}

async function getPersonalApplyPage(path, memberId, params = {}, defaultErrorMessage = '지원 목록을 불러오는 중 오류가 발생했습니다.') {
    const resolvedMemberId = resolveMemberId(memberId);
    if (resolvedMemberId == null) throw new Error('memberId가 필요합니다.');

    const query = buildPagingQuery(params);

    try {
        return await requestWithAuth(`${path}?${query.toString()}`, {
            method: 'GET',
            headers: { 'X-Member-Id': String(resolvedMemberId) },
        });
    } catch (error) {
        throw new Error(error?.message || defaultErrorMessage);
    }
}

export async function submitApply(payload, memberId) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (memberId != null) headers['X-Member-Id'] = String(memberId);

    const response = await fetch(`${API_BASE}/applies/apply`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });

    let result = null;
    try { result = await response.json(); } catch { result = null; }
    if (!response.ok) throw new Error(result?.error || result?.message || '지원서 제출 중 오류가 발생했습니다.');
    return result;
}

export async function getMyApplications(memberId, page = 0, size = 20) {
    return getPersonalApplyPage(
        '/applies/personal/applications',
        memberId,
        { page, size },
        '지원 목록을 불러오는 중 오류가 발생했습니다.',
    );
}

export async function getMyOffers(memberId, params = {}) {
    return getPersonalApplyPage(
        '/applies/personal/offers',
        memberId,
        params,
        '받은 제의 목록을 불러오는 중 오류가 발생했습니다.',
    );
}

export async function getMyWorks(memberId, params = {}) {
    return getPersonalApplyPage(
        '/applies/personal/works',
        memberId,
        params,
        '근무 목록을 불러오는 중 오류가 발생했습니다.',
    );
}

export async function getMyCompletedWorks(memberId, params = {}) {
    return getPersonalApplyPage(
        '/applies/personal/reviews',
        memberId,
        params,
        '완료된 근무 목록을 불러오는 중 오류가 발생했습니다.',
    );
}

export async function decideMyOffer(applyId, accept, memberId) {
    const resolvedMemberId = resolveMemberId(memberId);
    if (resolvedMemberId == null) throw new Error('memberId가 필요합니다.');

    return requestWithAuth(`/applies/${applyId}/decision`, {
        method: 'PATCH',
        headers: { 'X-Member-Id': String(resolvedMemberId) },
        body: { accept: Boolean(accept) },
    });
}

export async function cancelMyApply(applyId, memberId) {
    const resolvedMemberId = resolveMemberId(memberId);
    if (resolvedMemberId == null) throw new Error('memberId가 필요합니다.');

    return requestWithAuth(`/applies/${applyId}`, {
        method: 'DELETE',
        headers: { 'X-Member-Id': String(resolvedMemberId) },
    });
}

export async function getReviewableApplies(account, params = {}) {
    const storedMember = getStoredMember();
    const { page = 0, size = 20, type, recruitId } = params;

    const searchParams = new URLSearchParams();
    searchParams.set('page', page);
    searchParams.set('size', size);
    if (type) searchParams.set('type', type);
    if (recruitId) searchParams.set('recruitId', recruitId);

    const isBusiness = account?.memberType === 'BUSINESS';

    if (isBusiness) {
        const businessProfileId =
            account?.businessProfileId || account?.businessProfile?.id || account?.profileId ||
            storedMember?.businessProfileId || storedMember?.businessProfile?.id || storedMember?.profileId || '';

        return requestWithAuth(`/applies/business/reviews?${searchParams.toString()}`, {
            method: 'GET',
            headers: { 'X-Business-Profile-Id': String(businessProfileId) },
        });
    }

    return requestWithAuth(`/applies/personal/reviews?${searchParams.toString()}`, {
        method: 'GET',
        headers: { 'X-Member-Id': String(account?.id || storedMember?.id || '') },
    });
}