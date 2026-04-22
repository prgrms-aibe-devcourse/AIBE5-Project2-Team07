package com.example.aibe5_project2_team7.region;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RegionResponseDto {

    private Integer id;
    private String sido;
    private String sigungu;

    public static RegionResponseDto from(Region region) {
        return RegionResponseDto.builder()
                .id(region.getId())
                .sido(region.getSido())
                .sigungu(region.getSigungu())
                .build();
    }
}