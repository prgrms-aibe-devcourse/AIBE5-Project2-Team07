package com.example.aibe5_project2_team7.business_profile;

import com.example.aibe5_project2_team7.business_profile.request.BusinessCompanyEditRequest;
import com.example.aibe5_project2_team7.business_profile.request.BusinessMemberEditRequest;
import com.example.aibe5_project2_team7.business_profile.request.BusinessPasswordEditRequest;
import com.example.aibe5_project2_team7.business_profile.response.BusinessProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
public class BusinessProfileController {
    private final BusinessProfileService businessProfileService;

    // 본인 정보 조회
    @GetMapping("/business/account/me")
    public ResponseEntity<BusinessProfileResponse> getMyProfile(Authentication authentication) {
        String email = extractEmail(authentication);
        BusinessProfileResponse response = businessProfileService.getMyProfileByEmail(email);
        return ResponseEntity.ok(response);
    }

    // 가입자 정보 수정 (전화번호, 지역, 상세주소)
    @PatchMapping("/business/account/edit/member")
    public ResponseEntity<Void> editMyMember(
            Authentication authentication,
            @RequestBody BusinessMemberEditRequest request
    ) {
        String email = extractEmail(authentication);
        businessProfileService.editMyMemberByEmail(email, request);
        return ResponseEntity.noContent().build();
    }

    private String extractEmail(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "인증 정보가 없습니다.");
        }
        return authentication.getName();
    }

    // 비밀번호 수정
    @PatchMapping("/business/account/edit/password")
    public ResponseEntity<Void> editMyPassword(
            Authentication authentication,
            @RequestBody BusinessPasswordEditRequest request
    ) {
        String email = extractEmail(authentication);
        businessProfileService.editMyPasswordByEmail(email, request);
        return ResponseEntity.noContent().build();
    }

    // 사업자 정보 수정 (회사명, 설립일, 사업자등록번호)
    @PatchMapping("/business/account/edit/company")
    public ResponseEntity<Void> editMyCompany(
            Authentication authentication,
            @RequestBody BusinessCompanyEditRequest request
            ) {
        String email = extractEmail(authentication);
        businessProfileService.editMyCompanyByEmail(email, request);
        return ResponseEntity.noContent().build();
    }

    // 회원 탈퇴 (DELETE /business/account/delete)
}
