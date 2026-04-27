package com.example.aibe5_project2_team7.chat.service;

import com.example.aibe5_project2_team7.chat.dto.ChatHistoryCursorResponseDto;
import com.example.aibe5_project2_team7.chat.dto.ChatMessageDto;
import com.example.aibe5_project2_team7.chat.dto.MyChatRoomResponseDto;
import com.example.aibe5_project2_team7.chat.entity.ChatMessage;
import com.example.aibe5_project2_team7.chat.entity.ChatRoom;
import com.example.aibe5_project2_team7.chat.entity.ChatRoomMember;
import com.example.aibe5_project2_team7.chat.enumeration.MessageType;
import com.example.aibe5_project2_team7.chat.repository.ChatMessageRepository;
import com.example.aibe5_project2_team7.chat.repository.ChatRoomMemberRepository;
import com.example.aibe5_project2_team7.chat.repository.ChatRoomRepository;
import com.example.aibe5_project2_team7.chat.repository.projection.MyChatRoomProjection;
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
    private final ChatRoomMemberRepository chatRoomMemberRepository;

    @Transactional
    public String getOrCreateDirectRoomId(Long user1Id, Long user2Id) {
        String roomId = DirectRoomIdUtil.createRoomId(user1Id, user2Id);

        createRoomIfNotExists(roomId);
        addMemberIfNotExists(roomId, user1Id);
        addMemberIfNotExists(roomId, user2Id);

        return roomId;
    }

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
            // 동시에 생성 시도 시 무시
        }
    }

    @Transactional
    public void addMemberIfNotExists(String roomId, Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("userId는 필수입니다.");
        }

        if (chatRoomMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            return;
        }

        try {
            chatRoomMemberRepository.save(
                    ChatRoomMember.builder()
                            .roomId(roomId)
                            .userId(userId)
                            .build()
            );
        } catch (DataIntegrityViolationException e) {
            // 동시에 멤버 추가 시도 시 무시
        }
    }

    @Transactional
    public ChatMessageDto saveTalkMessage(ChatMessageDto dto) {
        validateTalkMessage(dto);

        if (dto.getReceiverId() != null) {
            String directRoomId = getOrCreateDirectRoomId(dto.getSenderId(), dto.getReceiverId());
            dto.setRoomId(directRoomId);
        } else {
            createRoomIfNotExists(dto.getRoomId());
            addMemberIfNotExists(dto.getRoomId(), dto.getSenderId());
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
        touchRoomLastMessageAt(saved.getRoomId(), saved.getSentAt());

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

    public List<MyChatRoomResponseDto> getMyChatRooms(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("userId는 필수입니다.");
        }

        List<MyChatRoomProjection> rows = chatRoomMemberRepository.findMyChatRooms(userId);

        return rows.stream()
                .map(row -> new MyChatRoomResponseDto(
                        row.getRoomId(),
                        row.getPartnerUserId(),
                        row.getPartnerEmail(),
                        row.getLastMessageContent(),
                        row.getLastMessageAt(),
                        row.getUnreadCount() == null ? 0L : row.getUnreadCount()
                ))
                .toList();
    }

    @Transactional
    public void markAsRead(String roomId, Long userId) {
        if (roomId == null || roomId.isBlank() || userId == null) {
            return;
        }

        chatRoomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .ifPresent(member -> {
                    Long latestMessageId = chatMessageRepository.findLatestMessageId(roomId);
                    member.setLastReadMessageId(latestMessageId);
                });
    }

    @Transactional
    protected void touchRoomLastMessageAt(String roomId, LocalDateTime lastMessageAt) {
        chatRoomRepository.findById(roomId)
                .ifPresent(room -> room.setLastMessageAt(lastMessageAt));
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

        if (dto.getReceiverId() == null) {
            if (dto.getRoomId() == null || dto.getRoomId().isBlank()) {
                throw new IllegalArgumentException("receiverId 또는 roomId는 필수입니다.");
            }
        } else if (dto.getSenderId().equals(dto.getReceiverId())) {
            throw new IllegalArgumentException("자기 자신에게는 메시지를 보낼 수 없습니다.");
        }
    }

    private int normalizeSize(int size) {
        if (size <= 0) {
            return 50;
        }
        return Math.min(size, 100);
    }
}