package com.example.aibe5_project2_team7.resume;

import com.example.aibe5_project2_team7.resume.Resume;
import com.example.aibe5_project2_team7.resume.ResumeService;
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
}
