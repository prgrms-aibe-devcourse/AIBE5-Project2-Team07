package com.example.aibe5_project2_team7.region;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, Integer> {
	// 시/도(sido) 값으로 해당 시/도의 모든 지역(Region)들을 조회합니다.
	List<Region> findBySido(String sido);
    Optional<Region> findBySidoAndSigungu(String sido, String sigungu);
}

