import { requestWithAuth, getStoredMember } from './authApi';

export async function getReviewableApplies(account, params = {}) {
    const storedMember = getStoredMember();

    const {
        page = 0,
        size = 20,
        type,
        recruitId,
    } = params;

    const searchParams = new URLSearchParams();
    searchParams.set('page', page);
    searchParams.set('size', size);

    if (type) searchParams.set('type', type);
    if (recruitId) searchParams.set('recruitId', recruitId);

    const isBusiness = account?.memberType === 'BUSINESS';

    if (isBusiness) {
        const businessProfileId =
            account?.businessProfileId ||
            account?.businessProfile?.id ||
            account?.profileId ||
            storedMember?.businessProfileId ||
            storedMember?.businessProfile?.id ||
            storedMember?.profileId ||
            '';

        console.log('business account:', account);
        console.log('stored business member:', storedMember);
        console.log('X-Business-Profile-Id:', businessProfileId);

        return requestWithAuth(`/applies/business/reviews?${searchParams.toString()}`, {
            method: 'GET',
            headers: {
                'X-Business-Profile-Id': String(businessProfileId),
            },
        });
    }

    return requestWithAuth(`/applies/personal/reviews?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
            'X-Member-Id': String(account?.id || storedMember?.id || ''),
        },
    });
}