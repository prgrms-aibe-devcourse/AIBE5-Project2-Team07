package com.example.aibe5_project2_team7.business_profile.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.example.aibe5_project2_team7.recruit.constant.Period;
import com.example.aibe5_project2_team7.recruit.constant.SalaryType;
import com.example.aibe5_project2_team7.member.MemberType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CompanyInfoResponse {
    private Long id;
    private Long memberId;
    private String companyName;
    private LocalDate foundedDate;
    private String companyPhone;
    private String homepageUrl;
    private Long brandId;
    private String brandName;
    private String companyAddress;
    private Integer ratingSum;
    private Integer ratingCount;
    private List<RecruitSummary> recruits = new ArrayList<>();
    private List<ReviewSummary> reviews = new ArrayList<>();
    private List<TopLabelSummary> topLabels = new ArrayList<>();

    @Getter
    @Setter
    public static class RecruitSummary {
        private Long id;

        @JsonProperty("isUrgent")
        private boolean urgent;

        private String title;
        private Integer salary;
        private SalaryType salaryType;
        private LocalDateTime createdAt;
        private List<Period> workPeriod = new ArrayList<>();
    }

    @Getter
    @Setter
    public static class ReviewSummary {
        private Long id;
        private Long applyId;
        private Long writerId;
        private Long targetId;
        private MemberType targetType;
        private Integer rating;
        private String content;
        private Long labelId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Getter
    @Setter
    public static class TopLabelSummary {
        private Long labelId;
        private String labelName;
    }

    //많이 받은 라벨 2개
    //최근 리뷰 3개
    //진행중인 최근 공고 3개
    //private String regionName;
    //private String detailAddress;
}
