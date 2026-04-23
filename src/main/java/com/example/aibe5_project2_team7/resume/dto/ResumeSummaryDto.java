package com.example.aibe5_project2_team7.resume.dto;

import com.example.aibe5_project2_team7.region.RegionResponseDto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter@Setter
public class ResumeSummaryDto {
    private Long resumeId;
    private Long memberId;
    private String title;
    private LocalDateTime updatedAt;
    private String memberName;
    private Double ratingAverage;
    private List<String> desiredBusinessTypes;
    private List<RegionResponseDto> preferredRegions;

    public ResumeSummaryDto(Long resumeId, Long memberId, String title, LocalDateTime updatedAt, String memberName, Double ratingAverage, List<String> desiredBusinessTypes,List<RegionResponseDto> preferredRegions) {
        this.resumeId = resumeId;
        this.memberId = memberId;
        this.title = title;
        this.updatedAt = updatedAt;
        this.memberName = memberName;
        this.ratingAverage = ratingAverage;
        this.desiredBusinessTypes = desiredBusinessTypes;
        this.preferredRegions = preferredRegions;
    }

}
