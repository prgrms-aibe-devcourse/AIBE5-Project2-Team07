package com.example.aibe5_project2_team7.chat.repository;

import com.example.aibe5_project2_team7.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query(value = """
            select *
            from chat_message
            where room_id = :roomId
            order by id desc
            limit :limit
            """, nativeQuery = true)
    List<ChatMessage> findRecentMessages(
            @Param("roomId") String roomId,
            @Param("limit") int limit
    );

    @Query(value = """
            select *
            from chat_message
            where room_id = :roomId
              and id < :cursorId
            order by id desc
            limit :limit
            """, nativeQuery = true)
    List<ChatMessage> findRecentMessagesBeforeCursor(
            @Param("roomId") String roomId,
            @Param("cursorId") Long cursorId,
            @Param("limit") int limit
    );

    @Query(value = """
            select id
            from chat_message
            where room_id = :roomId
            order by id desc
            limit 1
            """, nativeQuery = true)
    Long findLatestMessageId(@Param("roomId") String roomId);
}