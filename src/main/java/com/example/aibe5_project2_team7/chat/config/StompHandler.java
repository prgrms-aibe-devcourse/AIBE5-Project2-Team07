package com.example.aibe5_project2_team7.chat.config;

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

    @Override
    public @Nullable Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if(StompCommand.CONNECT.equals(accessor.getCommand())){
            String ip = (String)accessor.getSessionAttributes().get("ip");
            String email = accessor.getFirstNativeHeader("email");

            accessor.getSessionAttributes().put("email",email);
            log.info("🟢 [새로운 유저 접속] 이름: {}, IP: {}, SessionID: {}", email, ip, accessor.getSessionId());
            // 이후코드 jwt 작업 공간

        }
        else if(StompCommand.DISCONNECT.equals(accessor.getCommand())){
            String email = (String)accessor.getSessionAttributes().get("email");
            log.info("🔴 [유저 접속 종료]  SessionID: {} , 유저아이디 : {}", accessor.getSessionId(),email);
        }

        return message;
    }
}
