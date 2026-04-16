package com.example.aibe5_project2_team7.chat.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-connect")// connect 주소
                //.addInterceptors(new CustomHandshakeInterceptor())//ip 추출기
                .setAllowedOriginPatterns("*")
                .withSockJS();//http 통신허용
    }


    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        //구독 수신 addres : /sub/room/rommid
        registry.enableSimpleBroker("/sub");

        //송신 주소 : /pub/chat/content
        registry.setApplicationDestinationPrefixes("/pub");
    }
}
