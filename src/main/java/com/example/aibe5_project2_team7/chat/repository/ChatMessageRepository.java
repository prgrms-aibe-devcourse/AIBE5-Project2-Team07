package com.example.aibe5_project2_team7.chat.repository;


import com.example.aibe5_project2_team7.chat.entity.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    Slice<ChatMessage> findByRoomId(String roomId, Pageable pageable);
}