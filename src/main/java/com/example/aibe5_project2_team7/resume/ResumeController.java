package com.example.aibe5_project2_team7.resume;

import com.example.aibe5_project2_team7.resume.dto.ResumeDetailDto;
import com.example.aibe5_project2_team7.resume.dto.ResumeSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    // 전체 인재 조회
    @GetMapping("/human-resource")
    public ResponseEntity<?> listResumes(@RequestParam(defaultValue = "0") int page) {
        Page<ResumeSummaryDto> res = resumeService.getPublicResumes(page);
        return ResponseEntity.ok(res);
    }
    // 실시간 활동 인재 조회
    @GetMapping("/human-resource/active")
    public ResponseEntity<?> listActiveResumes(@RequestParam(defaultValue = "0") int page) {
        Page<ResumeSummaryDto> res = resumeService.getResumesByIndividualActive(page);
        return ResponseEntity.ok(res);
    }
    // 스페셜 인재 조회
    @GetMapping("/human-resource/special")
    public ResponseEntity<?> listSpecialResumes(@RequestParam(defaultValue = "0") int page) {
        Page<ResumeSummaryDto> res = resumeService.getResumesByIndividualSpecial(page);
        return ResponseEntity.ok(res);
    }
    // 업직종별 인재 조회
    @GetMapping("/human-resource/business-types")
    public ResponseEntity<?> searchByBusinessTypes(@RequestParam String types,
                                                   @RequestParam(defaultValue = "0") int page) {
        List<String> list = Arrays.stream(types.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        Page<ResumeSummaryDto> res = resumeService.getResumesByDesiredBusinessTypes(list, page);
        return ResponseEntity.ok(res);
    }
    // 지역별 인재 조회
    @GetMapping("/human-resource/regions")
    public ResponseEntity<?> searchByRegions(@RequestParam String regionIds,
                                             @RequestParam(defaultValue = "0") int page) {
        List<Long> ids = Arrays.stream(regionIds.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Long::valueOf)
                .collect(Collectors.toList());

        Page<ResumeSummaryDto> res = resumeService.getResumesByPreferredRegions(ids, page);
        return ResponseEntity.ok(res);
    }
    // 브랜드별 인재 조회
    @GetMapping("/human-resource/brands")
    public ResponseEntity<?> searchByBrands(@RequestParam String brandIds,
                                            @RequestParam(defaultValue = "0") int page) {
        List<Long> ids = Arrays.stream(brandIds.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Long::valueOf)
                .collect(Collectors.toList());

        Page<ResumeSummaryDto> res = resumeService.getResumesByBrandIds(ids, page);
        return ResponseEntity.ok(res);
    }
    // 인재 상세 보기
    @GetMapping("/human-resource/{id}")
    public ResponseEntity<?> getResumeDetail(@PathVariable Long id) {
        try {
            ResumeDetailDto dto = resumeService.getResumeDetail(id);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    java.util.Collections.singletonMap(
                            "error",
                            e.getMessage() != null ? e.getMessage() : "에러 발생"
                    )
            );
        }
    }
}
