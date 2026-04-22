package com.example.aibe5_project2_team7.recruit.controller;


import com.example.aibe5_project2_team7.recruit.dto.RecruitNearbyRequestDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitNearbyResponseDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitRecommendConditionRequestDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitRecommendResponseDto;
import com.example.aibe5_project2_team7.recruit.service.RecruitNearbyService;
import com.example.aibe5_project2_team7.recruit.service.RecruitRecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/recommend")
public class RecruitRecommendController {
    private final RecruitRecommendService recruitRecommendService;
    private final RecruitNearbyService recruitNearbyService;
    @PostMapping("/category")
    public List<RecruitRecommendResponseDto> getCategoryRecommend(
            @RequestBody RecruitRecommendConditionRequestDto condition) {

        return recruitRecommendService.getRecommendList(condition);
    }

    @PostMapping("/nearby")
    public List<RecruitNearbyResponseDto> findNearbyRecruits(
            @RequestBody RecruitNearbyRequestDto requestDto){

        return recruitNearbyService.findNearbyRecruits(requestDto);

    }
}