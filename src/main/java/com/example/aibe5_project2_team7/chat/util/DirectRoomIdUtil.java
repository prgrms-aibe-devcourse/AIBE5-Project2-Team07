package com.example.aibe5_project2_team7.chat.util;

public final class DirectRoomIdUtil {

    private DirectRoomIdUtil() {
    }

    public static String createRoomId(Long user1Id, Long user2Id) {
        validate(user1Id, user2Id);

        long small = Math.min(user1Id, user2Id);
        long large = Math.max(user1Id, user2Id);

        return "private_" + small + "_" + large;
    }

    private static void validate(Long user1Id, Long user2Id) {
        if (user1Id == null || user2Id == null) {
            throw new IllegalArgumentException("user1Id, user2Id는 필수입니다.");
        }
        if (user1Id.equals(user2Id)) {
            throw new IllegalArgumentException("자기 자신과의 채팅방은 만들 수 없습니다.");
        }
    }
}