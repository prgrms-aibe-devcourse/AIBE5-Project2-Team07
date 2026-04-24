package com.example.aibe5_project2_team7.chat.dto;

import java.util.List;

public record ChatHistoryCursorResponseDto(
        List<ChatMessageDto> messages,
        Long nextCursorId,
        boolean hasNext
) {
}