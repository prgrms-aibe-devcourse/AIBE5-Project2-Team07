package com.example.aibe5_project2_team7.chat.component;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class RoomSessionManager {

    private static final int MAX_CAPACITY = 2;

    // roomId -> memberId -> subscriptionKey(sessionId:subscriptionId) set
    private final ConcurrentHashMap<String, ConcurrentHashMap<Long, Set<String>>> roomMemberSubscriptions = new ConcurrentHashMap<>();
    // subscriptionKey(sessionId:subscriptionId) -> roomId
    private final ConcurrentHashMap<String, String> subscriptionRoomMap = new ConcurrentHashMap<>();
    // sessionId -> memberId
    private final ConcurrentHashMap<String, Long> sessionMemberMap = new ConcurrentHashMap<>();

    public void registerSessionMember(String sessionId, Long memberId) {
        if (sessionId == null || memberId == null) {
            return;
        }
        sessionMemberMap.put(sessionId, memberId);
    }

    public synchronized void addSubscription(String roomId, String sessionId, Long memberId, String subscriptionId) {
        if (roomId == null || roomId.isBlank()) {
            throw new IllegalArgumentException("roomId가 올바르지 않습니다.");
        }
        if (sessionId == null || sessionId.isBlank() || subscriptionId == null || subscriptionId.isBlank()) {
            throw new IllegalArgumentException("구독 정보가 올바르지 않습니다.");
        }
        if (memberId == null) {
            throw new IllegalArgumentException("회원 식별 정보가 없습니다. 다시 로그인 후 시도해 주세요.");
        }

        registerSessionMember(sessionId, memberId);

        ConcurrentHashMap<Long, Set<String>> memberSubscriptions =
                roomMemberSubscriptions.computeIfAbsent(roomId, key -> new ConcurrentHashMap<>());

        if (!memberSubscriptions.containsKey(memberId) && memberSubscriptions.size() >= MAX_CAPACITY) {
            log.warn("[입장 거부] roomId={}, memberId={}, 현재 인원={}", roomId, memberId, memberSubscriptions.size());
            throw new IllegalArgumentException("방 인원이 꽉 찼습니다. (최대 " + MAX_CAPACITY + "명)");
        }

        String subscriptionKey = buildSubscriptionKey(sessionId, subscriptionId);
        memberSubscriptions
                .computeIfAbsent(memberId, key -> ConcurrentHashMap.newKeySet())
                .add(subscriptionKey);
        subscriptionRoomMap.put(subscriptionKey, roomId);

        log.info("[입장 성공] roomId={}, memberId={}, 현재 인원={}", roomId, memberId, memberSubscriptions.size());
    }

    public synchronized void removeSubscription(String sessionId, String subscriptionId) {
        if (sessionId == null || sessionId.isBlank() || subscriptionId == null || subscriptionId.isBlank()) {
            return;
        }
        removeSubscriptionKey(buildSubscriptionKey(sessionId, subscriptionId));
    }

    public synchronized void removeSession(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            return;
        }

        String prefix = sessionId + ":";
        List<String> targets = new ArrayList<>();
        for (String subscriptionKey : subscriptionRoomMap.keySet()) {
            if (subscriptionKey.startsWith(prefix)) {
                targets.add(subscriptionKey);
            }
        }

        for (String subscriptionKey : targets) {
            removeSubscriptionKey(subscriptionKey);
        }

        sessionMemberMap.remove(sessionId);
    }

    private void removeSubscriptionKey(String subscriptionKey) {
        String roomId = subscriptionRoomMap.remove(subscriptionKey);
        if (roomId == null) {
            return;
        }

        String sessionId = extractSessionId(subscriptionKey);
        Long memberId = sessionMemberMap.get(sessionId);
        if (memberId == null) {
            cleanupEmptyRoom(roomId);
            return;
        }

        ConcurrentHashMap<Long, Set<String>> memberSubscriptions = roomMemberSubscriptions.get(roomId);
        if (memberSubscriptions == null) {
            return;
        }

        Set<String> subscriptions = memberSubscriptions.get(memberId);
        if (subscriptions != null) {
            subscriptions.remove(subscriptionKey);
            if (subscriptions.isEmpty()) {
                memberSubscriptions.remove(memberId);
            }
        }

        if (memberSubscriptions.isEmpty()) {
            roomMemberSubscriptions.remove(roomId);
        }

        log.info("[퇴장 처리] roomId={}, memberId={}, 남은 인원={}", roomId, memberId, memberSubscriptions.size());
    }

    private void cleanupEmptyRoom(String roomId) {
        ConcurrentHashMap<Long, Set<String>> memberSubscriptions = roomMemberSubscriptions.get(roomId);
        if (memberSubscriptions != null && memberSubscriptions.isEmpty()) {
            roomMemberSubscriptions.remove(roomId);
        }
    }

    private String buildSubscriptionKey(String sessionId, String subscriptionId) {
        return sessionId + ":" + subscriptionId;
    }

    private String extractSessionId(String subscriptionKey) {
        int index = subscriptionKey.indexOf(':');
        return index >= 0 ? subscriptionKey.substring(0, index) : subscriptionKey;
    }
}
