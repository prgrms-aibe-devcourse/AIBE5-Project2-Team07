package com.example.aibe5_project2_team7.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DirectRoomRequestDto {
    private Long user1Id;
    private Long user2Id;
}