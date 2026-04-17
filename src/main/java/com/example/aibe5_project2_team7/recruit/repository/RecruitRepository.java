package com.example.aibe5_project2_team7.recruit.repository;

import com.example.aibe5_project2_team7.recruit.Recruit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecruitRepository extends JpaRepository<Recruit,Long>,RecruitRecommendRepository {
    @Override
    List<Recruit> findAll();
}
