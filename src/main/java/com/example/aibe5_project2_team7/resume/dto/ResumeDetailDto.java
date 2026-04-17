package com.example.aibe5_project2_team7.resume.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ResumeDetailDto {
    private Long resumeId;
    private Long memberId;
    private String title;
    private String content;
    private LocalDateTime updatedAt;
    private String memberName;
    private Double ratingAverage;
    private List<String> desiredBusinessTypes;
    private List<Object> careers; // simple POJO or map representation
    private List<Object> licenses;
    private List<Object> educations;

    public ResumeDetailDto(Long resumeId, Long memberId, String title, String content, LocalDateTime updatedAt, String memberName, Double ratingAverage, List<String> desiredBusinessTypes, List<Object> careers, List<Object> licenses, List<Object> educations) {
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
    }

    // getters/setters omitted for brevity (add if needed)

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }
    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getMemberName() { return memberName; }
    public void setMemberName(String memberName) { this.memberName = memberName; }
    public Double getRatingAverage() { return ratingAverage; }
    public void setRatingAverage(Double ratingAverage) { this.ratingAverage = ratingAverage; }
    public List<String> getDesiredBusinessTypes() { return desiredBusinessTypes; }
    public void setDesiredBusinessTypes(List<String> desiredBusinessTypes) { this.desiredBusinessTypes = desiredBusinessTypes; }
    public List<Object> getCareers() { return careers; }
    public void setCareers(List<Object> careers) { this.careers = careers; }
    public List<Object> getLicenses() { return licenses; }
    public void setLicenses(List<Object> licenses) { this.licenses = licenses; }
    public List<Object> getEducations() { return educations; }
    public void setEducations(List<Object> educations) { this.educations = educations; }
}
