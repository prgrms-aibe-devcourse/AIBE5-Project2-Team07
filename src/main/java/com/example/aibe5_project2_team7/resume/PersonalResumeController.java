package com.example.aibe5_project2_team7.resume;

import com.example.aibe5_project2_team7.member.CustomUser;
import com.example.aibe5_project2_team7.resume.dto.ResumeDetailDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
            return ResponseEntity.badRequest().body(error(e, "이력서 생성 실패"));
        }
    }

    @GetMapping
    public ResponseEntity<?> getOwnResume(
            @AuthenticationPrincipal CustomUser user) {
        try {
            ResumeDetailDto dto = resumeService.getOwnResume(user.getId());
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e, "이력서 조회 실패"));
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
            return ResponseEntity.badRequest().body(error(e, "이력서 수정 실패"));
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteOwnResume(
            @AuthenticationPrincipal CustomUser user) {
        try {
            resumeService.deleteOwnResume(user.getId());
            return ResponseEntity.ok(success());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e, "이력서 삭제 실패"));
        }
    }

    private Map<String, Object> error(Exception e, String defaultMsg) {
        Map<String, Object> map = new HashMap<>();
        map.put("error", e.getMessage() != null ? e.getMessage() : defaultMsg);
        return map;
    }

    private Map<String, Object> success() {
        Map<String, Object> map = new HashMap<>();
        map.put("success", true);
        return map;
    }
}
