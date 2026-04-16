package com.example.aibe5_project2_team7.resume;

import com.example.aibe5_project2_team7.resume.dto.ResumeSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @GetMapping("/human-resource")
    public ResponseEntity<?> listResumes(@RequestParam(defaultValue = "0") int page) {
        Page<ResumeSummaryDto> res = resumeService.getPublicResumes(page);
        return ResponseEntity.ok(res);
    }
}
