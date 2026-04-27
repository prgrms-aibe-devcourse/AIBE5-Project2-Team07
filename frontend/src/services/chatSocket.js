import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');

export function createChatClient({ email, onConnect, onError }) {
  const client = new Client({
    webSocketFactory: () => new SockJS(`${API_BASE}/ws-connect`),
    connectHeaders: email ? { email } : {},
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: () => {},
    onConnect: (frame) => {
      onConnect?.(frame);
    },
    onStompError: (frame) => {
      onError?.(new Error(frame.headers?.message || 'STOMP 오류가 발생했습니다.'));
    },
    onWebSocketError: () => {
      onError?.(new Error('웹소켓 연결 중 오류가 발생했습니다.'));
    },
  });

  return client;
}

export function subscribeRoom(client, roomId, onMessage) {
  if (!client || !client.connected || !roomId) {
    return null;
  }

  return client.subscribe(`/sub/room/${roomId}`, (messageFrame) => {
    if (!messageFrame?.body) {
      return;
    }

    try {
      const payload = JSON.parse(messageFrame.body);
      onMessage?.(payload);
    } catch (error) {
      console.error('채팅 메시지 파싱 실패:', error);
    }
  });
}

export function publishChat(client, payload) {
  if (!client || !client.connected) {
    throw new Error('채팅 서버와 연결되어 있지 않습니다.');
  }

  client.publish({
    destination: '/pub/chat/message',
    body: JSON.stringify(payload),
  });
}
