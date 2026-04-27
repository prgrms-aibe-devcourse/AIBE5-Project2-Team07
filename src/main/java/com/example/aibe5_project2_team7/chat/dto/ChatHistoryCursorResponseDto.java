package com.example.aibe5_project2_team7.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistoryCursorResponseDto {
    private List<ChatMessageDto> messages;
    private Long nextCursorId;
    private boolean hasNext;
}