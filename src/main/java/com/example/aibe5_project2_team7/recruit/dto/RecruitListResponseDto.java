package com.example.aibe5_project2_team7.recruit.dto;

import com.example.aibe5_project2_team7.recruit.constant.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class RecruitListResponseDto { //공고 목록 조회할 때
    private Long id;
    private String title;
    private String companyName;         // 기업명
    private boolean isUrgent;
    private int salary;
    private SalaryType salaryType;
    private List<Period> workPeriod;
    private List<Days> workDays;
    private List<Times> workTime;
    private List<BusinessTypeName> businessType;
    private LocalDate deadline;         // 마감일
    private Integer regionId;           // 지역 ID
    private String regionName;          // 지역명 (sido + sigungu)
    private LocalDate createdAt;        // 등록일
    private RecruitStatus status;       // 공고 상태
}
