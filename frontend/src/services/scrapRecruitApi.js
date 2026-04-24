const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function buildHeaders(memberId, includeJson = false) {
  const token = localStorage.getItem('token');
  const headers = {};

  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (memberId != null) {
    headers['X-Member-Id'] = String(memberId);
  }

  return headers;
}

async function parseResponse(response, defaultErrorMessage) {
  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(result?.error || result?.message || defaultErrorMessage);
  }

  return result;
}

export async function addRecruitScrap(memberId, recruitId) {
  const response = await fetch(`${API_BASE}/scraps/recruits/${recruitId}`, {
    method: 'POST',
    headers: buildHeaders(memberId),
  });

  return parseResponse(response, '공고 스크랩 중 오류가 발생했습니다.');
}

export async function removeRecruitScrap(memberId, recruitId) {
  const response = await fetch(`${API_BASE}/scraps/recruits/${recruitId}`, {
    method: 'DELETE',
    headers: buildHeaders(memberId),
  });

  if (!response.ok) {
    let result = null;
    try {
      result = await response.json();
    } catch {
      result = null;
    }
    throw new Error(result?.error || result?.message || '공고 스크랩 해제 중 오류가 발생했습니다.');
  }

  return true;
}

export async function getMyScrapRecruitPage(memberId, page = 0) {
  const response = await fetch(`${API_BASE}/scraps/recruits?page=${page}`, {
    method: 'GET',
    headers: buildHeaders(memberId),
  });

  return parseResponse(response, '스크랩 공고 목록을 불러오는 중 오류가 발생했습니다.');
}

export async function getMyScrapRecruitIds(memberId) {
  let currentPage = 0;
  let totalPages = 1;
  const ids = new Set();

  while (currentPage < totalPages) {
    const result = await getMyScrapRecruitPage(memberId, currentPage);
    const items = Array.isArray(result?.content) ? result.content : [];

    items.forEach((item) => {
      const recruitId = item?.recruit?.id;
      if (recruitId != null) {
        ids.add(Number(recruitId));
      }
    });

    totalPages = Math.max(Number(result?.totalPages) || 1, 1);
    currentPage += 1;
  }

  return Array.from(ids);
}

