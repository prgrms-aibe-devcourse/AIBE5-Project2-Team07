import { getStoredMember, requestWithAuth } from './authApi';

async function requestJson(path, options = {}) {
  return requestWithAuth(path, options);
}

export function getCurrentMember() {
  return getStoredMember();
}

export function getCurrentMemberId() {
  const member = getStoredMember();
  return member?.id ?? member?.memberId ?? null;
}

export function isMemberLoggedIn() {
  return Boolean(getCurrentMemberId());
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
