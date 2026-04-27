package com.example.aibe5_project2_team7.chat.config;

import com.example.aibe5_project2_team7.chat.component.RoomSessionManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    private final RoomSessionManager roomSessionManager;

    @Override
    public @Nullable Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String ip = (String) accessor.getSessionAttributes().get("ip");
            String email = accessor.getFirstNativeHeader("email");
            Long memberId = parseMemberId(accessor.getFirstNativeHeader("memberId"));

            accessor.getSessionAttributes().put("email", email);
            if (memberId != null) {
                accessor.getSessionAttributes().put("memberId", memberId);
                roomSessionManager.registerSessionMember(accessor.getSessionId(), memberId);
            }

            log.info("🟢 [채팅접속] 이메일: {}, memberId: {}, IP: {}, SessionID: {}", email, memberId, ip, accessor.getSessionId());
        } else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
            String email = (String) accessor.getSessionAttributes().get("email");
            Object memberId = accessor.getSessionAttributes().get("memberId");
            String ip = (String) accessor.getSessionAttributes().get("ip");
            log.info("🔴 [채팅종료] 이메일: {}, memberId: {}, ip: {}, SessionID: {}", email, memberId, ip, accessor.getSessionId());
        }

        return message;
    }

    private Long parseMemberId(String memberIdHeader) {
        if (memberIdHeader == null || memberIdHeader.isBlank()) {
            return null;
        }
        try {
            return Long.parseLong(memberIdHeader);
        } catch (NumberFormatException e) {
            log.warn("유효하지 않은 memberId 헤더입니다. value={}", memberIdHeader);
            return null;
        }
    }
}
