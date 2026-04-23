package com.example.aibe5_project2_team7.recruit.repository;

import com.example.aibe5_project2_team7.recruit.dto.RecruitRecommendConditionRequestDto;
import com.example.aibe5_project2_team7.recruit.entity.Recruit;

import java.util.List;

public interface RecruitRecommendRepository {
    List<Recruit> getRecommendFieldSearch(RecruitRecommendConditionRequestDto condition);

    public List<Recruit> findNearbyRecruits(Double userLat, Double userLng, Double radiusKm);
}
