package com.example.aibe5_project2_team7.brand.dto;

import com.example.aibe5_project2_team7.recruit.constant.Days;
import com.example.aibe5_project2_team7.recruit.constant.Period;
import com.example.aibe5_project2_team7.recruit.constant.SalaryType;
import com.example.aibe5_project2_team7.recruit.constant.Times;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BrandLongRecruitDto {
    private Long id;

    @NotBlank(message = "제목은 필수 입력 값입니다.")
    private String title;

    @NotBlank(message = "회사명은 필수 입력 값입니다.")
    private String companyName;

    @NotNull(message = "급여는 필수 입력 값입니다.")
    private Integer salary;

    @NotNull(message = "급여 유형은 필수 입력 값입니다.")
    private SalaryType salaryType;

    @NotNull(message = "근무 기간은 필수 입력 값입니다.")
    private Period workPeriod;

    @NotNull(message = "근무 시간은 필수 입력 값입니다.")
    private Times workTime;

    private Long regionId;

    private List<Days> days;

    @NotBlank(message = "지역명은 필수 입력 값입니다.")
    private String regionName;

    @NotNull(message = "긴급 공고 여부는 필수 입력 값입니다.")
    private String isUrgent;

    @NotNull(message = "등록일은 필수 입력 값입니다.")
    private String createdAt;

    // 공고의 근무일/마감일(yyyy-MM-dd 또는 yyyy-MM-dd HH:mm:ss 형식)
    private String deadline;
}
