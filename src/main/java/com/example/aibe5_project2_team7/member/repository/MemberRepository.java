package com.example.aibe5_project2_team7.member.repository;

import com.example.aibe5_project2_team7.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member,Long> {
    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    @Query("select distinct m.id from Member m join m.preferredRegions r where r.id in :regionIds")
    List<Long> findDistinctIdByPreferredRegionsIdIn(List<Long> regionIds);
}
