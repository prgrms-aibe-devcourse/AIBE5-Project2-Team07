package com.example.aibe5_project2_team7.brand.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BrandUrgentDto {
    private Long brandId;
    private String brandName;
    private Long urgentCount;

    @JsonProperty("banner_img")
    private String bannerImg;

    @JsonProperty("logo_img")
    private String logoImg;
}
