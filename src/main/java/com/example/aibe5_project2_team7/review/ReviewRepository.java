package com.example.aibe5_project2_team7.review;

import com.example.aibe5_project2_team7.member.MemberType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTargetType(MemberType targetType);
    List<Review> findByTargetIdAndTargetType(Long targetId, MemberType targetType);
    List<Review> findTop3ByTargetIdAndTargetTypeOrderByCreatedAtDesc(Long targetId, MemberType targetType);
}
