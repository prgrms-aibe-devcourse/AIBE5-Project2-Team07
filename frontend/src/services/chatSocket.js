const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function buildSocketUrl() {
  return `${API_BASE}/ws-connect`;
}

export function createChatSocketClient({ email, onConnect, onDisconnect, onMessage, onError }) {
  const SockJS = window.SockJS;
  const StompJs = window.StompJs;

  if (!SockJS || !StompJs?.Client) {
    throw new Error('채팅 라이브러리를 불러오지 못했습니다. 페이지를 새로고침 해주세요.');
  }

  const subscriptions = new Map();

  const client = new StompJs.Client({
    webSocketFactory: () => new SockJS(buildSocketUrl()),
    connectHeaders: {
      email: email || '',
    },
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: () => {},
    onConnect: () => {
      onConnect?.();
    },
    onStompError: (frame) => {
      const message = frame?.headers?.message || '채팅 서버와 통신 중 오류가 발생했습니다.';
      onError?.(message);
    },
    onWebSocketClose: () => {
      onDisconnect?.();
    },
    onWebSocketError: () => {
      onError?.('채팅 소켓 연결 중 오류가 발생했습니다.');
    },
  });

  return {
    activate() {
      client.activate();
    },
    async deactivate() {
      subscriptions.clear();
      await client.deactivate();
    },
    isConnected() {
      return client.connected;
    },
    subscribe(destination) {
      if (!client.connected || subscriptions.has(destination)) {
        return;
      }

      const subscription = client.subscribe(destination, (message) => {
        try {
          const payload = JSON.parse(message.body);
          onMessage?.(payload, destination);
        } catch (error) {
          onError?.('채팅 메시지를 읽는 중 오류가 발생했습니다.');
        }
      });

      subscriptions.set(destination, subscription);
    },
    unsubscribe(destination) {
      const subscription = subscriptions.get(destination);
      if (!subscription) {
        return;
      }

      subscription.unsubscribe();
      subscriptions.delete(destination);
    },
    syncSubscriptions(destinations = []) {
      const next = new Set(destinations);

      Array.from(subscriptions.keys()).forEach((destination) => {
        if (!next.has(destination)) {
          this.unsubscribe(destination);
        }
      });

      destinations.forEach((destination) => {
        if (!subscriptions.has(destination)) {
          this.subscribe(destination);
        }
      });
    },
    publish(destination, payload) {
      if (!client.connected) {
        throw new Error('채팅 서버에 아직 연결되지 않았습니다.');
      }

      client.publish({
        destination,
        body: JSON.stringify(payload),
      });
    },
  };
}
