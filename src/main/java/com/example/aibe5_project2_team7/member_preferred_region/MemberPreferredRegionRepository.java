package com.example.aibe5_project2_team7.member_preferred_region;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberPreferredRegionRepository extends JpaRepository<MemberPreferredRegion, Long> {

    List<MemberPreferredRegion> findByMemberId(Long memberId);
}