package com.example.aibe5_project2_team7.individual_profile;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class IndividualProfileController {

    private final IndividualProfileRepository individualProfileRepository;

    @PatchMapping("/personal/{memberId}/activate")
    public ResponseEntity<?> activateProfile(@PathVariable Long memberId) {
        IndividualProfile p = individualProfileRepository.findByMemberId(memberId).orElse(null);
        if (p == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Individual profile not found"));
        }
        p.setIsActive(true);
        individualProfileRepository.save(p);
        return ResponseEntity.ok(java.util.Map.of("success", true));
    }
}
