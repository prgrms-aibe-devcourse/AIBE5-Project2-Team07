package com.example.aibe5_project2_team7.region;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class RegionController {
    private final RegionService regionService;

    @GetMapping("/api/regions")
    public List<RegionResponseDto> getAllRegions() {
        return regionService.getAllRegions();
    }
}
