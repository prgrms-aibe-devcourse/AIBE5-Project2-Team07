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

export async function removeBusinessScrapMember(individualProfileId) {
    const businessProfileId = resolveBusinessProfileId();

    return requestWithAuth(`/scraps/members/${encodeURIComponent(individualProfileId)}`, {
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

