package com.example.aibe5_project2_team7.chat.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MyChatRoomResponseDto {
    private String roomId;
    private Long partnerUserId;
    private String partnerEmail;
    private String lastMessageContent;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime lastMessageAt;

    private Long unreadCount;
}