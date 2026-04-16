package com.example.aibe5_project2_team7.brand;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;

@Getter
@Setter
public class BrandRandomDto {
    private Long id;
    @NotBlank(message = "브랜드 이름은 필수 입력 값입니다.")
    private String name;
    private String logo_img;

    private static ModelMapper modelMapper = new ModelMapper();
    public static BrandRandomDto of(Brand brand) {
        return modelMapper.map(brand, BrandRandomDto.class);
    }
}
