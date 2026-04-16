package com.example.aibe5_project2_team7.brand;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BrandUrgentDto {
    private Long brandId;
    private String brandName;
    private Long urgentCount;
}
