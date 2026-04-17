package com.example.aibe5_project2_team7.individual_profile;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IndividualProfileRepository extends JpaRepository<IndividualProfile, Long> {
    Optional<IndividualProfile> findByMemberId(Long memberId);
}
