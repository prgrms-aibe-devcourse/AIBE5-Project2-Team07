package com.example.aibe5_project2_team7.resume.dto;

import com.example.aibe5_project2_team7.region.RegionResponseDto;
import com.example.aibe5_project2_team7.review.dto.ReviewResponse;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ResumeDetailDto {
    private Long resumeId;
    private Long memberId;
    private String title;
    private String content;
    private LocalDateTime updatedAt;

    private String memberName;
    private Double ratingAverage;
    private LocalDate birthDate;
    private String gender;
    private String address;
    private String phone;
    private String email;
    private String profileImageUrl;

    private List<String> desiredBusinessTypes;
    private List<Object> careers;
    private List<Object> licenses;
    private List<Object> educations;
    private List<RegionResponseDto> preferredRegions;
    private List<ReviewResponse> reviews;
    private Boolean isActive;

    public ResumeDetailDto(
            Long resumeId,
            Long memberId,
            String title,
            String content,
            LocalDateTime updatedAt,
            String memberName,
            Double ratingAverage,
            LocalDate birthDate,
            String gender,
            String address,
            String phone,
            String email,
            String profileImageUrl,
            List<String> desiredBusinessTypes,
            List<Object> careers,
            List<Object> licenses,
            List<Object> educations,
            List<RegionResponseDto> preferredRegions,
            List<ReviewResponse> reviews,
            Boolean isActive
    ) {
        this.resumeId = resumeId;
        this.memberId = memberId;
        this.title = title;
        this.content = content;
        this.updatedAt = updatedAt;
        this.memberName = memberName;
        this.ratingAverage = ratingAverage != null ? ratingAverage : 0.0;
        this.reviews = reviews != null ? reviews : new ArrayList<>();
        this.birthDate = birthDate;
        this.gender = gender;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.profileImageUrl = profileImageUrl;
        this.desiredBusinessTypes = desiredBusinessTypes;
        this.careers = careers;
        this.licenses = licenses;
        this.educations = educations;
        this.preferredRegions = preferredRegions;
        this.isActive = isActive;

    }
}