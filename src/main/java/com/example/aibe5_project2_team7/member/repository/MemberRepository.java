package com.example.aibe5_project2_team7.member.repository;

import com.example.aibe5_project2_team7.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member,Long> {
    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
