package com.example.aibe5_project2_team7.license;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LicenseRepository extends JpaRepository<License, Long> {
    List<License> findByMemberId(Long memberId);
}
