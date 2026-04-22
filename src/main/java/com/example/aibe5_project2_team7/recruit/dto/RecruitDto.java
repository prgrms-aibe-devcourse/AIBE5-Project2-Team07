package com.example.aibe5_project2_team7.recruit.dto;

import com.example.aibe5_project2_team7.recruit.constant.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecruitDto {

    private Long id;
    private Boolean isUrgent;
    private BusinessTypeName businessTypeName;
    private Days days;
    private Period period;
    private RecruitStatus recruitStatus;
    private SalaryType salaryType;
    private Times times;
}
