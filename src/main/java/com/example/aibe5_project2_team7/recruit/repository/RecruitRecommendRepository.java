package com.example.aibe5_project2_team7.recruit.repository;

import com.example.aibe5_project2_team7.recruit.dto.RecruitDto;
import com.example.aibe5_project2_team7.recruit.entity.Recruit;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface RecruitRecommendRepository {
    List<Recruit> getRecommendFieldSearch(RecruitDto recruitDto);
}
