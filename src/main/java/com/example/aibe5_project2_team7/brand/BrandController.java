package com.example.aibe5_project2_team7.brand;

import com.example.aibe5_project2_team7.brand.dto.*;
import com.example.aibe5_project2_team7.brand.response.BrandRecruitListResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
public class BrandController {
    private final BrandService brandService;

    @GetMapping(value = "/api/brand/search/autocomplete")
    public @ResponseBody ResponseEntity<List<BrandSearchAutoCompleteDto>> search(
            @RequestParam(name = "q", required = false) String q) {

        if (q == null || q.trim().isEmpty()) {
            // empty query -> return empty list (200) for autocomplete UX
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<BrandSearchAutoCompleteDto> results = brandService.getSearchList(q.trim());
        return ResponseEntity.ok(results);
    }

    @GetMapping(value = "/api/brand/random")
    public @ResponseBody ResponseEntity<List<BrandRandomDto>> getRandom8Brands() {
        List<BrandRandomDto> results = brandService.getRandom8Brands();
        return ResponseEntity.ok(results);
    }

    @GetMapping(value = "/api/brand/modal/right")
    public @ResponseBody ResponseEntity<List<BrandRecruitCountDto>> getBrandAndRecruitCounts(
            @RequestParam(name = "businessType") com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName businessType) {
        List<BrandRecruitCountDto> results = brandService.getBrandAndRecruitCounts(businessType);
        return ResponseEntity.ok(results);
    }

    @GetMapping(value = "/api/brand/urgent")
    public @ResponseBody ResponseEntity<List<BrandUrgentDto>> getRandom3UrgentBrands() {
        List<BrandUrgentDto> results = brandService.getRandom3UrgentBrands();
        return ResponseEntity.ok(results);
    }

    @GetMapping(value = "/api/brand/{brandId}/recruits/short")
    public @ResponseBody ResponseEntity<BrandRecruitListResponse<BrandShortRecruitDto>> getBrandShortRecruits(
            @PathVariable(name = "brandId") Long brandId,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "region_id", required = false) Long regionId,
            @RequestParam(name = "work_date", required = false) List<String> workDate,
            @RequestParam(name = "work_time", required = false) List<String> workTime,
            @RequestParam(name = "sort", required = false) String sort) {
        BrandRecruitListResponse<BrandShortRecruitDto> results = brandService.getBrandShortRecruitList(brandId, page, regionId, workDate, workTime, sort);
        return ResponseEntity.ok(results);
    }

    @GetMapping(value = "/api/brand/{brandId}/recruits/long")
    public @ResponseBody ResponseEntity<BrandRecruitListResponse<BrandLongRecruitDto>> getBrandLongRecruits(
            @PathVariable(name = "brandId") Long brandId,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "region_id", required = false) Long regionId,
            @RequestParam(name = "work_period", required = false) List<String> workPeriod,
            @RequestParam(name = "work_time", required = false) List<String> workTime,
            @RequestParam(name = "work_days", required = false) List<String> workDays,
            @RequestParam(name = "sort", required = false) String sort) {
        BrandRecruitListResponse<BrandLongRecruitDto> results = brandService.getBrandLongRecruits(brandId, page, regionId, workPeriod, workTime, workDays, sort);
        return ResponseEntity.ok(results);
    }
}
