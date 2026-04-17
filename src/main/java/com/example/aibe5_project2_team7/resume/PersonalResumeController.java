package com.example.aibe5_project2_team7.resume;

import com.example.aibe5_project2_team7.resume.dto.ResumeDetailDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/personal/resume")
@RequiredArgsConstructor
public class PersonalResumeController {

    private final ResumeService resumeService;

    @PostMapping
    public ResponseEntity<?> createResume(@RequestBody Map<String, Object> payload) {
        try {
            Resume r = resumeService.createResume(payload);
            return ResponseEntity.ok(r);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<?> getOwnResume(@PathVariable Long memberId) {
        try {
            ResumeDetailDto dto = resumeService.getOwnResume(memberId);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{memberId}")
    public ResponseEntity<?> patchOwnResume(@PathVariable Long memberId, @RequestBody Map<String, Object> payload) {
        try {
            Resume updated = resumeService.patchOwnResume(memberId, payload);
            ResumeDetailDto dto = resumeService.getResumeDetail(updated.getId());
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<?> deleteOwnResume(@PathVariable Long memberId) {
        try{
            resumeService.deleteOwnResume(memberId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
