import { requestWithAuth } from './authApi';

export async function getDirectRoom(user1Id, user2Id) {
  return requestWithAuth('/api/chat/rooms/direct', {
    method: 'POST',
    body: JSON.stringify({ user1Id, user2Id }),
  });
}

export async function getMyChatRooms(userId) {
  return requestWithAuth(`/api/chat/rooms/my?userId=${encodeURIComponent(userId)}`, {
    method: 'GET',
  });
}

export async function getChatHistory(roomId, cursorId = null, size = 30) {
  const params = new URLSearchParams();
  params.set('size', String(size));

  if (cursorId) {
    params.set('cursorId', String(cursorId));
  }

  return requestWithAuth(`/api/chat/rooms/${encodeURIComponent(roomId)}/messages?${params.toString()}`, {
    method: 'GET',
  });
}
