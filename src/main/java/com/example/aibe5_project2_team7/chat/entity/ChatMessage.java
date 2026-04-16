package com.example.aibe5_project2_team7.chat.entity;

import com.example.aibe5_project2_team7.chat.enumeration.MessageType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long senderId;
    private String content;
    private String email;
    private String roomId;
    @Enumerated(EnumType.STRING)
    MessageType type;
    private LocalDateTime sentAt = LocalDateTime.now();
}
