package com.example.aibe5_project2_team7.chat.controller;

import com.example.aibe5_project2_team7.chat.dto.ChatMessageDto;
import com.example.aibe5_project2_team7.chat.enumeration.MessageType;
import com.example.aibe5_project2_team7.chat.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat/message")
    public void message(@Payload ChatMessageDto message) {
        if (message.getSentAt() == null) {
            message.setSentAt(LocalDateTime.now());
        }

        if (message.getType() == null) {
            message.setType(MessageType.TALK);
        }

        if (message.getReceiverId() != null) {
            String normalizedRoomId = chatMessageService.getOrCreateDirectRoomId(
                    message.getSenderId(),
                    message.getReceiverId()
            );
            message.setRoomId(normalizedRoomId);
        }

        switch (message.getType()) {
            case ENTER -> {
                chatMessageService.markAsRead(message.getRoomId(), message.getSenderId());
                return;
            }
            case LEAVE -> {
                return;
            }
            case TALK -> {
                message = chatMessageService.saveTalkMessage(message);
                chatMessageService.markAsRead(message.getRoomId(), message.getSenderId());
            }
        }

        messagingTemplate.convertAndSend("/sub/room/" + message.getRoomId(), message);
    }
}
