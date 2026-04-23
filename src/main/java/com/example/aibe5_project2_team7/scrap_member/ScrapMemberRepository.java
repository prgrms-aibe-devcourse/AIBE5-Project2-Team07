package com.example.aibe5_project2_team7.scrap_member;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ScrapMemberRepository extends JpaRepository<ScrapMember, Long> {
    //이미 스크랩했는지 확인(중복 방지)
    boolean existsByBusinessProfileIdAndIndividualProfileId(Long businessId, Long individualId);
    //스크랩 취소할 때 찾기
    Optional<ScrapMember> findByBusinessProfileIdAndIndividualProfileId(Long businessId, Long individualId);
    //특정 회원의 스크랩 개수
    Long countByBusinessProfileId(Long businessId);

    // BusinessId로 스크랩한 Individual profile까지 가져오기
    @Query("select s from ScrapMember s " +
            "join fetch s.individualProfile i " +
            "where s.businessProfile.id = :businessProfileId")
    List<ScrapMember> findAllByBusinessProfileIdWithIndividual(Long businessProfileId);
}
