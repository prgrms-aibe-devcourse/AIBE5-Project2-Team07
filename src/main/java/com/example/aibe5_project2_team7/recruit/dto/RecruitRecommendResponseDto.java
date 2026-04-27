package com.example.aibe5_project2_team7.recruit.dto;

import com.example.aibe5_project2_team7.recruit.constant.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecruitRecommendResponseDto {
    private Long recruitId;
    private Long businessMemberId;
    private String title;
    private boolean urgent;
    private RecruitStatus status;
    private LocalDate deadline;

    private int salary;
    private SalaryType salaryType;
    private Integer headCount;

    private Integer regionId;
    private String sido;
    private String sigungu;
    private String detailAddress;

    private String description;
    private String resumeFormUrl;

    private List<Period> workPeriod;
    private List<Days> workDays;
    private List<Times> workTime;
    private List<BusinessTypeName> businessType;
}
