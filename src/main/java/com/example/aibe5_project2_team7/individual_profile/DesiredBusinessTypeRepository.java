package com.example.aibe5_project2_team7.individual_profile;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DesiredBusinessTypeRepository extends JpaRepository<DesiredBusinessType, Long> {
    List<DesiredBusinessType> findByMemberId(Long memberId);
}
