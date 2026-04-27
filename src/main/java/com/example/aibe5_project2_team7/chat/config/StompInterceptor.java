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
                case SUBSCRIBE -> {
                    String destination = accessor.getDestination();
                    if (destination != null && destination.startsWith("/sub/room/")) {
                        String roomId = destination.substring("/sub/room/".length());
                        String subscriptionId = accessor.getSubscriptionId();
                        Long memberId = extractMemberId(accessor);
                        roomSessionManager.addSubscription(roomId, sessionId, memberId, subscriptionId);
                    }
                }
                case UNSUBSCRIBE -> roomSessionManager.removeSubscription(sessionId, accessor.getSubscriptionId());
                case DISCONNECT -> roomSessionManager.removeSession(sessionId);
            }
        }
        return message;
    }

    private Long extractMemberId(StompHeaderAccessor accessor) {
        Object memberId = accessor.getSessionAttributes() == null ? null : accessor.getSessionAttributes().get("memberId");
        if (memberId instanceof Long longValue) {
            return longValue;
        }
        if (memberId instanceof String stringValue) {
            try {
                return Long.parseLong(stringValue);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }
}
