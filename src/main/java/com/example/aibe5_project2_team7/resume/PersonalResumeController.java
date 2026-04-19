package com.example.aibe5_project2_team7.resume;

import com.example.aibe5_project2_team7.member.CustomUser;
import com.example.aibe5_project2_team7.resume.dto.ResumeDetailDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/personal/resume")
@RequiredArgsConstructor
public class PersonalResumeController {

    private final ResumeService resumeService;

    @PostMapping
    public ResponseEntity<?> createResume(
            @AuthenticationPrincipal CustomUser user,
            @RequestBody Map<String, Object> payload) {
        try {
            Resume r = resumeService.createResume(user.getId(), payload);
            return ResponseEntity.ok(r);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getOwnResume(
            @AuthenticationPrincipal CustomUser user) {
        try {
            ResumeDetailDto dto = resumeService.getOwnResume(user.getId());
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping
    public ResponseEntity<?> patchOwnResume(
            @AuthenticationPrincipal CustomUser user,
            @RequestBody Map<String, Object> payload) {
        try {
            Resume updated = resumeService.patchOwnResume(user.getId(), payload);
            ResumeDetailDto dto = resumeService.getResumeDetail(updated.getId());
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteOwnResume(
            @AuthenticationPrincipal CustomUser user) {
        try {
            resumeService.deleteOwnResume(user.getId());
            return ResponseEntity.ok(Map.of("success", true));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
