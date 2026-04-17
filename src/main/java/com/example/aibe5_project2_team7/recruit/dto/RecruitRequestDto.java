package com.example.aibe5_project2_team7.recruit.dto;

import com.example.aibe5_project2_team7.recruit.constant.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter @Setter
public class RecruitRequestDto { //공고 등록할 때
    private String title;
    private Long brandId;
    private boolean isUrgent;
    private LocalDate deadline;
    private int salary;
    private SalaryType salaryType;
    private Integer headCount;
    private Integer regionId;
    private String detailAddress;
    private List<Period> workPeriod;
    private List<Days> workDays;
    private List<Times> workTime;
    private List<BusinessTypeName> businessType;
    private String description;
    private String resumeFormUrl;
}
