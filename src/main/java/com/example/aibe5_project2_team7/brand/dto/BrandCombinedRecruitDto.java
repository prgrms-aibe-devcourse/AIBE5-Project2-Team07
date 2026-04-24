package com.example.aibe5_project2_team7.brand.dto;

import com.example.aibe5_project2_team7.recruit.constant.Days;
import com.example.aibe5_project2_team7.recruit.constant.Period;
import com.example.aibe5_project2_team7.recruit.constant.SalaryType;
import com.example.aibe5_project2_team7.recruit.constant.Times;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BrandCombinedRecruitDto {
    private Long id;
    private String recruitType;
    private String title;
    private String companyName;
    private Integer salary;
    private SalaryType salaryType;
    private Period workPeriod;
    private Times workTime;
    private Long regionId;
    private List<Days> days;
    private String regionName;
    private String isUrgent;
    private String createdAt;
    private String deadline;
}

