package com.example.aibe5_project2_team7.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ChatHistoryCursorResponseDto {
    private List<ChatMessageDto> messages;
    private Long nextCursorId;
    private boolean hasNext;
}