package com.example.aibe5_project2_team7.chat.dto;

import com.example.aibe5_project2_team7.chat.enumeration.MessageType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private Long senderId;
    private String content;
    private String email;
    private String roomId;
    private MessageType type;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime sentAt;
}
