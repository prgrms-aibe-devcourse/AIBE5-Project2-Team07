package com.example.aibe5_project2_team7.region;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionService {
    private final RegionRepository regionRepository;
    public List<RegionResponseDto> getAllRegions() {
        return regionRepository.findAll()
                .stream()
                .map(region -> new RegionResponseDto (
                        region.getId(),
                        region.getSido() + " " + region.getSigungu(),
                        region.getSido(),
                        region.getSigungu()
                )).toList();
    }
}
