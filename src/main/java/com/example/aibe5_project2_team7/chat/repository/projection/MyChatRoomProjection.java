package com.example.aibe5_project2_team7.chat.repository.projection;

import java.time.LocalDateTime;

public interface MyChatRoomProjection {
    String getRoomId();
    Long getPartnerUserId();
    String getPartnerEmail();
    String getLastMessageContent();
    LocalDateTime getLastMessageAt();
    Long getUnreadCount();
}