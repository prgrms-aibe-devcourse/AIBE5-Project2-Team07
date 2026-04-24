package com.example.aibe5_project2_team7.chat.dto;

import com.example.aibe5_project2_team7.chat.entity.ChatMessage;
import com.example.aibe5_project2_team7.chat.enumeration.MessageType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDto {
    private Long id;
    private Long senderId;
    private Long receiverId;   // 1:1 채팅용 상대방 ID
    private String content;
    private String email;
    private String roomId;
    private MessageType type;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime sentAt;

    public static ChatMessageDto from(ChatMessage chatMessage) {
        return ChatMessageDto.builder()
                .id(chatMessage.getId())
                .senderId(chatMessage.getSenderId())
                .content(chatMessage.getContent())
                .email(chatMessage.getEmail())
                .roomId(chatMessage.getRoomId())
                .type(chatMessage.getType())
                .sentAt(chatMessage.getSentAt())
                .build();
    }
}