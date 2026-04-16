package com.example.aibe5_project2_team7.chat.entity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/chat/message")
    public void message(@Payload ChatMessage message){
        //방으로 들어올때 모든 메시지 읽음처리
        if ("ENTER".equals(message.getType())) {
            message.setContent(message.getContent() + "님이 입장하셨습니다.");
        }
        // 추가: 방에없을때 안읽음표시
        else if ("LEAVE".equals(message.getType())) {
            message.setContent(message.getContent() + "님이 퇴장하셨습니다.");
        }


        //해당 채팅방 즉 구독했던곳에 메시지를 브로드캐스트 방식으로 뿌림
        messagingTemplate.convertAndSend("/sub/room/" + message.getRoomId(), message);
    }

}
