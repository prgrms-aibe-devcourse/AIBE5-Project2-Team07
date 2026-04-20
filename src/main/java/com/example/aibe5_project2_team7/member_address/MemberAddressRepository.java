package com.example.aibe5_project2_team7.member_address;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberAddressRepository extends JpaRepository<MemberAddress, Long> {
    Optional<MemberAddress> findByMemberId_Id(Long memberId);
}

