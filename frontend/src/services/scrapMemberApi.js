import { getStoredMember, requestWithAuth } from './authApi';

function resolveBusinessProfileId() {
    const storedMember = getStoredMember();
    return (
        storedMember?.businessProfileId ||
        storedMember?.businessProfile?.id ||
        storedMember?.profileId ||
        ''
    );
}

export async function getBusinessScrapMembers(params = {}) {
    const businessProfileId = resolveBusinessProfileId();
    const { page = 0 } = params;

    return requestWithAuth(`/scraps/members?page=${encodeURIComponent(page)}`, {
        method: 'GET',
        headers: {
            'X-Business-Profile-Id': String(businessProfileId),
        },
    });
}

export async function addBusinessScrapMember(individualProfileId) {
    const businessProfileId = resolveBusinessProfileId();

    return requestWithAuth(`/scraps/members/${encodeURIComponent(individualProfileId)}`, {
        method: 'POST',
        headers: {
            'X-Business-Profile-Id': String(businessProfileId),
        },
    });
}

export async function addBusinessScrapMemberByMemberId(memberId) {
    const businessProfileId = resolveBusinessProfileId();

    return requestWithAuth(`/scraps/members/by-member/${encodeURIComponent(memberId)}`, {
        method: 'POST',
        headers: {
            'X-Business-Profile-Id': String(businessProfileId),
        },
    });
}

export async function checkBusinessScrapMemberByMemberId(memberId) {
    const businessProfileId = resolveBusinessProfileId();

    return requestWithAuth(`/scraps/members/by-member/${encodeURIComponent(memberId)}/exists`, {
        method: 'GET',
        headers: {
            'X-Business-Profile-Id': String(businessProfileId),
        },
    });
}

export async function removeBusinessScrapMember(individualProfileId) {
    const businessProfileId = resolveBusinessProfileId();

    return requestWithAuth(`/scraps/members/${encodeURIComponent(individualProfileId)}`, {
        method: 'DELETE',
        headers: {
            'X-Business-Profile-Id': String(businessProfileId),
        },
    });
}

export async function removeBusinessScrapMemberByMemberId(memberId) {
    const businessProfileId = resolveBusinessProfileId();

    return requestWithAuth(`/scraps/members/by-member/${encodeURIComponent(memberId)}`, {
        method: 'DELETE',
        headers: {
            'X-Business-Profile-Id': String(businessProfileId),
        },
    });
}

export async function getBusinessScrapMemberCount() {
    const businessProfileId = resolveBusinessProfileId();

    return requestWithAuth('/scraps/members/count', {
        method: 'GET',
        headers: {
            'X-Business-Profile-Id': String(businessProfileId),
        },
    });
}

