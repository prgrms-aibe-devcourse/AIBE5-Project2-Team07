package com.example.aibe5_project2_team7.chat.controller;

import com.example.aibe5_project2_team7.chat.dto.DirectRoomRequestDto;
import com.example.aibe5_project2_team7.chat.dto.DirectRoomResponseDto;
import com.example.aibe5_project2_team7.chat.dto.MyChatRoomResponseDto;
import com.example.aibe5_project2_team7.chat.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat/rooms")
public class ChatRoomController {

    private final ChatMessageService chatMessageService;

    @PostMapping("/direct")
    public DirectRoomResponseDto getOrCreateDirectRoom(@RequestBody DirectRoomRequestDto request) {
        String roomId = chatMessageService.getOrCreateDirectRoomId(
                request.getUser1Id(),
                request.getUser2Id()
        );
        return new DirectRoomResponseDto(roomId);
    }

    @GetMapping("/my")
    public List<MyChatRoomResponseDto> getMyChatRooms(@RequestParam Long userId) {
        return chatMessageService.getMyChatRooms(userId);
    }
}