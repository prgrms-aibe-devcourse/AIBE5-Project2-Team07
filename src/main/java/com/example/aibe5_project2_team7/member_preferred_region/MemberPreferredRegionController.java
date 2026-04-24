package com.example.aibe5_project2_team7.member_preferred_region;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.aibe5_project2_team7.member.CustomUser;

import java.util.List;

@RestController
@RequestMapping("/personal/{memberId}/preferred-regions")
@RequiredArgsConstructor
public class MemberPreferredRegionController {
    private final MemberPreferredRegionService service;

    @GetMapping
    public ResponseEntity<?> getPreferred(@PathVariable Long memberId, @AuthenticationPrincipal CustomUser user) {
        // 권한 검증: 요청한 memberId와 토큰의 user id가 같아야 함
        if (user == null || !user.getId().equals(memberId)) {
            return ResponseEntity.status(403).build();
        }
        List<?> res = service.getPreferredRegions(memberId);
        return ResponseEntity.ok(res);
    }

    @PostMapping
    public ResponseEntity<?> savePreferred(@PathVariable Long memberId, @AuthenticationPrincipal CustomUser user, @RequestBody PreferredRegionRequestDto req) {
        if (user == null || !user.getId().equals(memberId)) {
            return ResponseEntity.status(403).build();
        }
        service.replacePreferredRegions(memberId, req.getRegionIds());
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<?> updatePreferred(@PathVariable Long memberId, @AuthenticationPrincipal CustomUser user, @RequestBody PreferredRegionRequestDto req) {
        if (user == null || !user.getId().equals(memberId)) {
            return ResponseEntity.status(403).build();
        }
        service.replacePreferredRegions(memberId, req.getRegionIds());
        return ResponseEntity.ok().build();
    }
}
