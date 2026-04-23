package com.example.aibe5_project2_team7.chat.component;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class RoomSessionManager {

    // roomId -> 해당 방에 접속 중인 sessionId 목록
    private final ConcurrentHashMap<String, Set<String>> roomSessions = new ConcurrentHashMap<>();
    private final int MAX_CAPACITY = 2; // ★ 방 최대 인원 (1:1 방이니까 2명으로 제한!)

    // 1. 방에 입장(구독) 시도
    public synchronized void addSessionToRoom(String roomId, String sessionId) {
        roomSessions.putIfAbsent(roomId, ConcurrentHashMap.newKeySet());
        Set<String> sessions = roomSessions.get(roomId);

        // ★ 핵심: 2명이 꽉 찼으면 에러를 던져서 입장을 막아버린다!
        if (sessions.size() >= MAX_CAPACITY) {
            log.warn("[입장 거부] 방이 꽉 찼습니다. roomId: {}", roomId);
            throw new IllegalArgumentException("방 인원이 꽉 찼습니다. (최대 " + MAX_CAPACITY + "명)");
        }

        sessions.add(sessionId);
        log.info("[입장 성공] roomId: {}, 현재 인원: {}", roomId, sessions.size());
    }

    // 2. 방에서 퇴장(구독 취소/연결 끊김) 시
    public synchronized void removeSessionFromRoom(String sessionId) {
        // 모든 방을 뒤져서 해당 sessionId를 지워줍니다.
        roomSessions.forEach((roomId, sessions) -> {
            if (sessions.remove(sessionId)) {
                log.info("[퇴장 완료] roomId: {}, 남은 인원: {}", roomId, sessions.size());
            }
        });
    }
}