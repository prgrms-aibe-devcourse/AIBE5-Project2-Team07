package com.example.aibe5_project2_team7.brand;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BrandRecruitCountDto {
    private Long brandId;
    private String brandName;
    private Long urgentCount;
    private Long normalCount;
}
