package com.example.aibe5_project2_team7.recruit.dto;

import com.example.aibe5_project2_team7.recruit.constant.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecruitRecommendConditionRequestDto {


    private Long regionId;

    private List<Period> workPeriod;
    private List<Days> workDays;
    private List<Times> workTime;
    private List<BusinessTypeName> businessType;

    private SalaryType salaryType;
    private Boolean urgent;
    @Builder.Default
    private Integer resultCount=20;//선택안하면 20개

    public Integer getResultCount() {
        return resultCount == null?20:resultCount;
    }
}
