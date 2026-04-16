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
            log.info("🟢 [채팅접속] 이메일: {}, IP: {}, SessionID: {}", email, ip, accessor.getSessionId());
            // 이후코드 jwt 작업 공간
        }
        else if(StompCommand.DISCONNECT.equals(accessor.getCommand())){
            String email = (String)accessor.getSessionAttributes().get("email");
            String ip = (String)accessor.getSessionAttributes().get("ip");
            log.info("🔴 [채팅종료]  , 이메일 : {} ,ip : {},SessionID: {} ", email,ip,accessor.getSessionId());
        }

        return message;
    }
}
