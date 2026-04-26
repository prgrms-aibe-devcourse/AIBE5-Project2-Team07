package com.example.aibe5_project2_team7.brand;

import com.example.aibe5_project2_team7.brand.dto.BrandCombinedRecruitDto;
import com.example.aibe5_project2_team7.brand.dto.BrandLongRecruitDto;
import com.example.aibe5_project2_team7.brand.dto.BrandRandomDto;
import com.example.aibe5_project2_team7.brand.dto.BrandRecruitCountDto;
import com.example.aibe5_project2_team7.brand.dto.BrandSearchAutoCompleteDto;
import com.example.aibe5_project2_team7.brand.dto.BrandShortRecruitDto;
import com.example.aibe5_project2_team7.brand.dto.BrandSummaryDto;
import com.example.aibe5_project2_team7.brand.dto.BrandUrgentDto;
import com.example.aibe5_project2_team7.brand.response.BrandRecruitListResponse;
import com.example.aibe5_project2_team7.region.Region;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityNotFoundException;

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

    @GetMapping(value = "/api/brand/{brandId}/summary")
    public @ResponseBody ResponseEntity<BrandSummaryDto> getBrandSummary(@PathVariable(name = "brandId") Long brandId) {
        BrandSummaryDto result = brandService.getBrandSummary(brandId);
        return ResponseEntity.ok(result);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource not found");
    }

    @GetMapping(value = "/api/brand/{brandId}/recruits/short")
    public @ResponseBody ResponseEntity<BrandRecruitListResponse<BrandShortRecruitDto>> getBrandShortRecruits(
            @PathVariable(name = "brandId") Long brandId,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "region_id", required = false) List<Long> regionIds,
            @RequestParam(name = "work_date", required = false) List<String> workDate,
            @RequestParam(name = "work_time", required = false) List<String> workTime,
            @RequestParam(name = "urgent_only", required = false) Boolean urgentOnly,
            @RequestParam(name = "sort", required = false) String sort) {
        BrandRecruitListResponse<BrandShortRecruitDto> results = brandService.getBrandShortRecruitList(brandId, page, regionIds, workDate, workTime, urgentOnly, sort);
        return ResponseEntity.ok(results);
    }

    @GetMapping(value = "/api/brand/{brandId}/recruits/long")
    public @ResponseBody ResponseEntity<BrandRecruitListResponse<BrandLongRecruitDto>> getBrandLongRecruits(
            @PathVariable(name = "brandId") Long brandId,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "region_id", required = false) List<Long> regionIds,
            @RequestParam(name = "work_period", required = false) List<String> workPeriod,
            @RequestParam(name = "work_time", required = false) List<String> workTime,
            @RequestParam(name = "work_days", required = false) List<String> workDays,
            @RequestParam(name = "exclude_days", required = false) List<String> excludeDays,
            @RequestParam(name = "sort", required = false) String sort) {
        BrandRecruitListResponse<BrandLongRecruitDto> results = brandService.getBrandLongRecruits(brandId, page, regionIds, workPeriod, workTime, workDays, excludeDays, sort);
        return ResponseEntity.ok(results);
    }

    @GetMapping(value = "/api/brand/{brandId}/recruits")
    public @ResponseBody ResponseEntity<BrandRecruitListResponse<BrandCombinedRecruitDto>> getBrandRecruits(
            @PathVariable(name = "brandId") Long brandId,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "region_id", required = false) List<Long> regionIds,
            @RequestParam(name = "work_time", required = false) List<String> workTime,
            @RequestParam(name = "sort", required = false) String sort,
            @RequestParam(name = "work_date", required = false) List<String> workDate,
            @RequestParam(name = "urgent_only", required = false) Boolean urgentOnly,
            @RequestParam(name = "work_period", required = false) List<String> workPeriod,
            @RequestParam(name = "work_days", required = false) List<String> workDays,
            @RequestParam(name = "exclude_days", required = false) List<String> excludeDays) {
        BrandRecruitListResponse<BrandCombinedRecruitDto> results = brandService.getBrandRecruits(
                brandId,
                page,
                regionIds,
                workTime,
                sort,
                workDate,
                urgentOnly,
                workPeriod,
                workDays,
                excludeDays
        );
        return ResponseEntity.ok(results);
    }

    @GetMapping(value = "/api/brand/regionFilter/{sido}")
    public @ResponseBody List<Region> getRegionsBySido(@PathVariable String sido) {
        return brandService.getRegionsBySido(sido);
    }
}
