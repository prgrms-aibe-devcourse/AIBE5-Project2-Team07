package com.example.aibe5_project2_team7.resume.dto;

import java.time.LocalDateTime;

public class ResumeSummaryDto {
    private Long resumeId;
    private Long memberId;
    private String title;
    private LocalDateTime updatedAt;
    private String memberName;
    private Double ratingAverage;

    public ResumeSummaryDto(Long resumeId, Long memberId, String title, LocalDateTime updatedAt, String memberName, Double ratingAverage) {
        this.resumeId = resumeId;
        this.memberId = memberId;
        this.title = title;
        this.updatedAt = updatedAt;
        this.memberName = memberName;
        this.ratingAverage = ratingAverage;
    }

    // getters/setters
    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }
    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getMemberName() { return memberName; }
    public void setMemberName(String memberName) { this.memberName = memberName; }
    public Double getRatingAverage() { return ratingAverage; }
    public void setRatingAverage(Double ratingAverage) { this.ratingAverage = ratingAverage; }
}
