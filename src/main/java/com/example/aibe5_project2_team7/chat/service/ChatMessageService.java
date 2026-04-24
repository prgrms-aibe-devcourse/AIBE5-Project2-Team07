package com.example.aibe5_project2_team7.chat.service;

import com.example.aibe5_project2_team7.chat.dto.ChatHistoryCursorResponseDto;
import com.example.aibe5_project2_team7.chat.dto.ChatMessageDto;
import com.example.aibe5_project2_team7.chat.entity.ChatMessage;
import com.example.aibe5_project2_team7.chat.entity.ChatRoom;
import com.example.aibe5_project2_team7.chat.enumeration.MessageType;
import com.example.aibe5_project2_team7.chat.repository.ChatMessageRepository;
import com.example.aibe5_project2_team7.chat.repository.ChatRoomRepository;
import com.example.aibe5_project2_team7.chat.util.DirectRoomIdUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;

    @Transactional
    public void createRoomIfNotExists(String roomId) {
        if (roomId == null || roomId.isBlank()) {
            throw new IllegalArgumentException("roomId는 필수입니다.");
        }

        if (chatRoomRepository.existsById(roomId)) {
            return;
        }

        try {
            chatRoomRepository.save(
                    ChatRoom.builder()
                            .id(roomId)
                            .build()
            );
        } catch (DataIntegrityViolationException e) {
            // 동시에 최초 생성이 겹친 경우 무시
        }
    }

    @Transactional
    public String getOrCreateDirectRoomId(Long user1Id, Long user2Id) {
        String roomId = DirectRoomIdUtil.createRoomId(user1Id, user2Id);
        createRoomIfNotExists(roomId);
        return roomId;
    }

    @Transactional
    public ChatMessageDto saveTalkMessage(ChatMessageDto dto) {
        validateTalkMessage(dto);

        // 1:1 채팅이면 백엔드에서 roomId를 강제 정규화
        if (dto.getReceiverId() != null) {
            dto.setRoomId(getOrCreateDirectRoomId(dto.getSenderId(), dto.getReceiverId()));
        } else {
            createRoomIfNotExists(dto.getRoomId());
        }

        ChatMessage chatMessage = ChatMessage.builder()
                .senderId(dto.getSenderId())
                .content(dto.getContent().trim())
                .email(dto.getEmail())
                .roomId(dto.getRoomId())
                .type(MessageType.TALK)
                .sentAt(dto.getSentAt() == null ? LocalDateTime.now() : dto.getSentAt())
                .build();

        ChatMessage saved = chatMessageRepository.save(chatMessage);
        return ChatMessageDto.from(saved);
    }

    public ChatHistoryCursorResponseDto getChatHistory(String roomId, Long cursorId, int size) {
        if (roomId == null || roomId.isBlank()) {
            throw new IllegalArgumentException("roomId는 필수입니다.");
        }

        int normalizedSize = normalizeSize(size);

        List<ChatMessage> rows;
        if (cursorId == null) {
            rows = chatMessageRepository.findRecentMessages(roomId, normalizedSize + 1);
        } else {
            rows = chatMessageRepository.findRecentMessagesBeforeCursor(roomId, cursorId, normalizedSize + 1);
        }

        boolean hasNext = rows.size() > normalizedSize;

        if (hasNext) {
            rows = new ArrayList<>(rows.subList(0, normalizedSize));
        }

        Long nextCursorId = null;
        if (hasNext && !rows.isEmpty()) {
            nextCursorId = rows.get(rows.size() - 1).getId();
        }

        List<ChatMessageDto> messages = new ArrayList<>(
                rows.stream()
                        .map(ChatMessageDto::from)
                        .toList()
        );

        Collections.reverse(messages);

        return new ChatHistoryCursorResponseDto(messages, nextCursorId, hasNext);
    }

    private void validateTalkMessage(ChatMessageDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("메시지 데이터가 없습니다.");
        }
        if (dto.getSenderId() == null) {
            throw new IllegalArgumentException("senderId는 필수입니다.");
        }
        if (dto.getContent() == null || dto.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("메시지 내용은 비어 있을 수 없습니다.");
        }

        // 1:1 채팅이면 receiverId 필수
        if (dto.getReceiverId() != null) {
            if (dto.getSenderId().equals(dto.getReceiverId())) {
                throw new IllegalArgumentException("자기 자신에게는 메시지를 보낼 수 없습니다.");
            }
        } else {
            if (dto.getRoomId() == null || dto.getRoomId().isBlank()) {
                throw new IllegalArgumentException("roomId 또는 receiverId 중 하나는 필요합니다.");
            }
        }
    }

    private int normalizeSize(int size) {
        if (size <= 0) {
            return 50;
        }
        return Math.min(size, 100);
    }
}