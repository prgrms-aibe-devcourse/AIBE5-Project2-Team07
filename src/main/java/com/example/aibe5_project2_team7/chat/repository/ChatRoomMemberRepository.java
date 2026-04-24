package com.example.aibe5_project2_team7.chat.repository;

import com.example.aibe5_project2_team7.chat.entity.ChatRoomMember;
import com.example.aibe5_project2_team7.chat.repository.projection.MyChatRoomProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {

    boolean existsByRoomIdAndUserId(String roomId, Long userId);

    Optional<ChatRoomMember> findByRoomIdAndUserId(String roomId, Long userId);

    List<ChatRoomMember> findByUserId(Long userId);

    @Query(value = """
            select
                crm.room_id as roomId,
                (
                    select crm2.user_id
                    from chat_room_member crm2
                    where crm2.room_id = crm.room_id
                      and crm2.user_id <> :userId
                    limit 1
                ) as partnerUserId,
                (
                    select cm.content
                    from chat_message cm
                    where cm.room_id = crm.room_id
                    order by cm.id desc
                    limit 1
                ) as lastMessageContent,
                (
                    select cm.sent_at
                    from chat_message cm
                    where cm.room_id = crm.room_id
                    order by cm.id desc
                    limit 1
                ) as lastMessageAt,
                (
                    select count(*)
                    from chat_message cm
                    where cm.room_id = crm.room_id
                      and (crm.last_read_message_id is null or cm.id > crm.last_read_message_id)
                      and cm.sender_id <> :userId
                ) as unreadCount
            from chat_room_member crm
            join chat_room cr on cr.id = crm.room_id
            where crm.user_id = :userId
            order by coalesce(cr.last_message_at, cr.created_at) desc
            """, nativeQuery = true)
    List<MyChatRoomProjection> findMyChatRooms(@Param("userId") Long userId);
}