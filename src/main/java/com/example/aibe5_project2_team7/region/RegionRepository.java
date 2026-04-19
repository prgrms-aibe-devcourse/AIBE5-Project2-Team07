package com.example.aibe5_project2_team7.region;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, Integer> {
    Optional<Region> findBySidoAndSigungu(String sido, String sigungu);
}

