import { getStoredMember, requestWithAuth } from './authApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function buildUrl(path) {
  if (path.startsWith('http')) {
    return path;
  }
  return `${API_BASE}${path}`;
}

async function requestJson(path, options = {}) {
  if (localStorage.getItem('token')) {
    return requestWithAuth(path, options);
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let result = null;
  try {
    result = await response.json();
  } catch (error) {
    result = null;
  }

  if (!response.ok) {
    throw new Error(result?.error || result?.message || '요청 처리 중 오류가 발생했습니다.');
  }

  return result;
}

export function getCurrentMember() {
  return getStoredMember();
}

export function getCurrentMemberId() {
  const member = getStoredMember();
  return member?.id ?? member?.memberId ?? null;
}

export function isMemberLoggedIn() {
  return Boolean(localStorage.getItem('token') && getCurrentMemberId());
}

export function getCurrentMemberType() {
  const member = getStoredMember();
  return member?.memberType ?? member?.type ?? null;
}

export async function createDirectRoom(user1Id, user2Id) {
  return requestJson('/api/chat/rooms/direct', {
    method: 'POST',
    body: JSON.stringify({ user1Id, user2Id }),
  });
}

export async function getMyChatRooms(userId) {
  const query = new URLSearchParams({ userId: String(userId) });
  return requestJson(`/api/chat/rooms/my?${query.toString()}`, {
    method: 'GET',
  });
}

export async function getChatMessages(roomId, cursorId = null, size = 50) {
  const query = new URLSearchParams({ size: String(size) });
  if (cursorId != null) {
    query.set('cursorId', String(cursorId));
  }
  return requestJson(`/api/chat/rooms/${encodeURIComponent(roomId)}/messages?${query.toString()}`, {
    method: 'GET',
  });
}
