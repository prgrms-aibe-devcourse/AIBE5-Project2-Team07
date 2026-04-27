package com.example.aibe5_project2_team7.chat.controller;

import com.example.aibe5_project2_team7.chat.dto.ChatHistoryCursorResponseDto;
import com.example.aibe5_project2_team7.chat.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat/rooms")
public class ChatHistoryController {

    private final ChatMessageService chatMessageService;

    @GetMapping("/{roomId}/messages")
    public ChatHistoryCursorResponseDto getChatHistory(
            @PathVariable String roomId,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(defaultValue = "50") int size
    ) {
        return chatMessageService.getChatHistory(roomId, cursorId, size);
    }
}