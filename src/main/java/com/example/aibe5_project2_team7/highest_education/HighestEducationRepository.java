package com.example.aibe5_project2_team7.highest_education;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HighestEducationRepository extends JpaRepository<HighestEducation, Long> {
    List<HighestEducation> findByMemberId(Long memberId);
}
