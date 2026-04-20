package com.example.aibe5_project2_team7.recruit.dto;

import com.example.aibe5_project2_team7.brand.entity.Brand;
import com.example.aibe5_project2_team7.recruit.constant.*;
import com.example.aibe5_project2_team7.recruit.entity.BusinessType;
import com.example.aibe5_project2_team7.recruit.entity.WorkDays;
import com.example.aibe5_project2_team7.recruit.entity.WorkPeriod;
import com.example.aibe5_project2_team7.recruit.entity.WorkTime;
import com.example.aibe5_project2_team7.region.Region;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecruitRecommendConditionDto {


    private Long regionId;

    private List<Period> workPeriod;
    private List<Days> workDays;
    private List<Times> workTime;
    private List<BusinessTypeName> businessType;

    private SalaryType salaryType;
    private Boolean urgent;
    @Builder.Default
    private int resultCount=20;//선택안하면 20개
}
