package com.example.aibe5_project2_team7.resume.dto;

import com.example.aibe5_project2_team7.region.RegionResponseDto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter@Setter
public class ResumeDetailDto {
    private Long resumeId;
    private Long memberId;
    private String title;
    private String content;
    private LocalDateTime updatedAt;
    private String memberName;
    private Double ratingAverage;
    private List<String> desiredBusinessTypes;
    private List<Object> careers;
    private List<Object> licenses;
    private List<Object> educations;
    private List<RegionResponseDto> preferredRegions;

    public ResumeDetailDto(Long resumeId, Long memberId, String title, String content, LocalDateTime updatedAt, String memberName, Double ratingAverage, List<String> desiredBusinessTypes, List<Object> careers, List<Object> licenses, List<Object> educations,List<RegionResponseDto> preferredRegions) {
        this.resumeId = resumeId;
        this.memberId = memberId;
        this.title = title;
        this.content = content;
        this.updatedAt = updatedAt;
        this.memberName = memberName;
        this.ratingAverage = ratingAverage;
        this.desiredBusinessTypes = desiredBusinessTypes;
        this.careers = careers;
        this.licenses = licenses;
        this.educations = educations;
        this.preferredRegions = preferredRegions;
    }

}
