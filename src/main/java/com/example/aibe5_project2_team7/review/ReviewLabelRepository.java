package com.example.aibe5_project2_team7.review;

import com.example.aibe5_project2_team7.member.MemberType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewLabelRepository extends JpaRepository<ReviewLabel, Long> {
    // 타입별 라벨 조회 (프론트 내려줄 때 사용)
    List<ReviewLabel> findByTargetType(MemberType targetType);
}
