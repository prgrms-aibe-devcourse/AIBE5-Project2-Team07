import { getToken, requestWithAuth, getStoredMember } from './authApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function submitApply(payload, memberId) {
  const token = getToken();
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
  if (memberId == null) throw new Error('memberId가 필요합니다.');

  const token = getToken();
  const headers = { 'X-Member-Id': String(memberId) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const query = new URLSearchParams({ page: String(page), size: String(size) });

  const response = await fetch(`${API_BASE}/applies/personal/applications?${query.toString()}`, {
    method: 'GET',
    headers,
  });

  let result = null;
  try { result = await response.json(); } catch { result = null; }
  if (!response.ok) throw new Error(result?.error || result?.message || '지원 목록을 불러오는 중 오류가 발생했습니다.');
  return result;
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