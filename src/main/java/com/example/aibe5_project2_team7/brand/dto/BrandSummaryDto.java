package com.example.aibe5_project2_team7.brand.dto;

import com.example.aibe5_project2_team7.brand.entity.Brand;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;

@Getter
@Setter
public class BrandSummaryDto {
    private Long id;
    private String name;
    private String logoImg;
    private String bannerImg;
    private String description;

    private static ModelMapper modelMapper = new ModelMapper();
    public static BrandSummaryDto of(Brand brand) {
        return modelMapper.map(brand, BrandSummaryDto.class);
    }
}
