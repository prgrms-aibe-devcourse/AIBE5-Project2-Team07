package com.example.aibe5_project2_team7.individual_profile;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class IndividualProfileController {

    private final IndividualProfileRepository individualProfileRepository;

    @PatchMapping("/personal/{memberId}/activate")
    public ResponseEntity<?> activateProfile(@PathVariable Long memberId, @RequestBody(required = false) Map<String, Object> payload) {
        IndividualProfile p = individualProfileRepository.findByMemberId(memberId).orElse(null);
        if (p == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Individual profile not found"));
        }

        if (payload == null || !payload.containsKey("isActive")) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "isActive field required in request body"));
        }

        Object raw = payload.get("isActive");
        Boolean flag;
        try {
            flag = raw == null ? null : Boolean.valueOf(raw.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "isActive must be boolean"));
        }

        if (flag == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "isActive must be boolean"));
        }

        p.setIsActive(flag);
        individualProfileRepository.save(p);
        return ResponseEntity.ok(java.util.Map.of("success", true, "isActive", flag));
    }
}
