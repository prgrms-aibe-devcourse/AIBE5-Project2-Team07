package com.example.aibe5_project2_team7.chat.config;

import com.example.aibe5_project2_team7.chat.component.RoomSessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StompInterceptor implements ChannelInterceptor {

    private final RoomSessionManager roomSessionManager;


    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && accessor.getCommand() != null) {
            String sessionId = accessor.getSessionId();

            switch (accessor.getCommand()) {
                case SUBSCRIBE: // 프론트가 구독(입장)을 시도할 때!
                    String destination = accessor.getDestination(); // 예: /sub/room/private_A_B
                    if (destination != null && destination.startsWith("/sub/room/")) {
                        String roomId = destination.substring("/sub/room/".length());

                        // ★ 매니저에게 입장이 가능한지 물어본다. 꽉 찼으면 여기서 Exception이 터짐!
                        roomSessionManager.addSessionToRoom(roomId, sessionId);
                    }
                    break;

                case UNSUBSCRIBE: // 방에서 나갈 때
                case DISCONNECT:  // 브라우저를 끄거나 연결이 끊겼을 때
                    // 매니저에게 이 세션을 방 인원에서 빼달라고 요청한다.
                    roomSessionManager.removeSessionFromRoom(sessionId);
                    break;
            }
        }
        return message; // 문제없으면 통과!
    }
}