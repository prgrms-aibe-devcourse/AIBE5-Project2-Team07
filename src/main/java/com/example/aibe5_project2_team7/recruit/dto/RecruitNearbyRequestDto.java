package com.example.aibe5_project2_team7.recruit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruitNearbyRequestDto {

    private Double latitude;   // 사용자 현재 위도
    private Double longitude;  // 사용자 현재 경도
    private Double radiusKm;   // 반경 km

    public Double getRadiusKm() {
        return radiusKm == null ? 3.0 : radiusKm;
    }
}