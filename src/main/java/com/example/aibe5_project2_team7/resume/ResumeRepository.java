package com.example.aibe5_project2_team7.resume;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
    @Query("select r from Resume r join fetch r.member where r.visibility = true") // N+1 문제
    Page<Resume> findByVisibilityTrue(Pageable pageable);

    @Query("select r from Resume r where r.visibility = true and r.memberId in :memberIds")
    Page<Resume> findPublicByMemberIds(@Param("memberIds") List<Long> memberIds, Pageable pageable);

    Optional<Resume> findByMemberId(Long memberId);

    Page<Resume> findByVisibilityTrueAndMemberIdIn(List<Long> memberIds, Pageable pageable);
}
