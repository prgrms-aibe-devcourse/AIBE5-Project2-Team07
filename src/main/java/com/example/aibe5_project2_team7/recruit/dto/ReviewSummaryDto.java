package com.example.aibe5_project2_team7.recruit.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ReviewSummaryDto {
    private Float avgRating;          // 평균 별점
    private List<String> topLabels;   // 상위 라벨 목록 (최대 2개)
}

