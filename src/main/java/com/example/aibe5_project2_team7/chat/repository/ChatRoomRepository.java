package com.example.aibe5_project2_team7.chat.repository;

import com.example.aibe5_project2_team7.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
}