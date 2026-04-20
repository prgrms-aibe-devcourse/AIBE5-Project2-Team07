package com.example.aibe5_project2_team7.scrap_recruit;

import com.example.aibe5_project2_team7.recruit.dto.RecruitListResponseDto;
import lombok.Getter;

/**
 * 스크랩 공고 응답 DTO
 * - 공고 목록 정보는 RecruitListResponseDto를 그대로 재사용
 * - 스크랩 고유 ID(scrapId)만 추가
 */
@Getter
public class ScrapRecruitResponse {
    private final Long scrapId;
    private final RecruitListResponseDto recruit;

    public ScrapRecruitResponse(Long scrapId, RecruitListResponseDto recruit) {
        this.scrapId = scrapId;
        this.recruit = recruit;
    }
}
