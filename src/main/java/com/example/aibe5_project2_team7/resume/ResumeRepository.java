package com.example.aibe5_project2_team7.resume;

import com.example.aibe5_project2_team7.resume.dto.ResumeSummaryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
    @Query("select r from Resume r join fetch r.member where r.visibility = true") // N+1 문제
    Page<Resume> findByVisibilityTrue(Pageable pageable);

    @Query("select r from Resume r where r.visibility = true and r.memberId in :memberIds")
    Page<Resume> findPublicByMemberIds(@Param("memberIds") List<Long> memberIds, Pageable pageable);

    Optional<Resume> findByMemberId(Long memberId);

    Page<Resume> findByVisibilityTrueAndMemberIdIn(List<Long> memberIds, Pageable pageable);

    Optional<Resume> findByCareers_Id(Long careerId);
    Optional<Resume> findByLicenses_Id(Long licenseId);
    Optional<Resume> findByEducations_Id(Long educationId);

    @Query("""
    SELECT r
    FROM Resume r
    JOIN Member m ON r.memberId = m.id
    WHERE r.visibility = true
    ORDER BY
        CASE 
            WHEN m.ratingCount IS NULL OR m.ratingCount = 0 THEN 0
            ELSE (m.ratingSum * 1.0 / m.ratingCount)
        END DESC,
        r.updatedAt DESC
""")
    Page<Resume> findPublicResumesOrderByRating(Pageable pageable);

    @Query("""
    SELECT r
    FROM Resume r
    LEFT JOIN Career c ON c.resume.id = r.id
    WHERE r.visibility = true
    GROUP BY r
    ORDER BY COUNT(c) DESC, r.updatedAt DESC
""")
    Page<Resume> findPublicResumesOrderByCareerCount(Pageable pageable);

    // --- new: memberIds + order by rating ---
    @Query("""
    SELECT r
    FROM Resume r
    JOIN Member m ON r.memberId = m.id
    WHERE r.visibility = true AND r.memberId IN :memberIds
    ORDER BY
        CASE 
            WHEN m.ratingCount IS NULL OR m.ratingCount = 0 THEN 0
            ELSE (m.ratingSum * 1.0 / m.ratingCount)
        END DESC,
        r.updatedAt DESC
""")
    Page<Resume> findPublicByMemberIdsOrderByRating(@Param("memberIds") List<Long> memberIds, Pageable pageable);

    // --- new: memberIds + order by career count ---
    @Query("""
    SELECT r
    FROM Resume r
    LEFT JOIN Career c ON c.resume.id = r.id
    WHERE r.visibility = true AND r.memberId IN :memberIds
    GROUP BY r
    ORDER BY COUNT(c) DESC, r.updatedAt DESC
""")
    Page<Resume> findPublicByMemberIdsOrderByCareerCount(@Param("memberIds") List<Long> memberIds, Pageable pageable);
}
