package com.example.aibe5_project2_team7.scrap_recruit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ScrapRecruitRepository extends JpaRepository<ScrapRecruit, Long> {
    // 이미 스크랩했는지 확인(중복 방지)
    boolean existsByMemberIdAndRecruitId(Long memberId, Long recruitId);
    // 스크랩 취소할 때 찾기
    Optional<ScrapRecruit> findByMemberIdAndRecruitId(Long memberId, Long recruitId);
    // 특정 회원의 스크랩 목록 조회
    List<ScrapRecruit> findAllByMemberId(Long memberId);
    // 특정 회원의 스크랩 개수
    Long countByMemberId(Long memberId);

    // memberId로 스크랩 한 recruit까지 가져오기
    @Query(value = "select s from ScrapRecruit s join fetch s.recruit r where s.member.id = :memberId",
            countQuery = "select count(s) from ScrapRecruit s where s.member.id = :memberId")
    org.springframework.data.domain.Page<ScrapRecruit> findAllByMemberIdWithRecruit(Long memberId, org.springframework.data.domain.Pageable pageable);
}
