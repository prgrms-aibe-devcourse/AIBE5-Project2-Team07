package com.example.aibe5_project2_team7.business_profile;

import com.example.aibe5_project2_team7.business_profile.request.BusinessCompanyEditRequest;
import com.example.aibe5_project2_team7.business_profile.request.BusinessMemberEditRequest;
import com.example.aibe5_project2_team7.business_profile.request.BusinessPasswordEditRequest;
import com.example.aibe5_project2_team7.business_profile.request.BusinessDeleteRequest;
import com.example.aibe5_project2_team7.business_profile.response.BusinessProfileResponse;
import com.example.aibe5_project2_team7.business_profile.response.CompanyInfoResponse;
import com.example.aibe5_project2_team7.business_profile.response.CompanySummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
public class BusinessProfileController {
    private final BusinessProfileService businessProfileService;

    /*
    // 기업 정보 조회 (임시 비활성화)
    @GetMapping("/business/profile/{businessId}")
    public ResponseEntity<CompanyInfoResponse> getBusinessProfile(@PathVariable Long businessId) {
        CompanyInfoResponse response = businessProfileService.getBusinessProfileById(businessId);
        return ResponseEntity.ok(response);
    }
    */

    // 기업명, 사업자등록번호 조회
    @GetMapping("/business/account/summary")
    public ResponseEntity<CompanySummaryResponse> getMyCompanySummary(Authentication authentication) {
        String email = extractEmail(authentication);
        CompanySummaryResponse response = businessProfileService.getMyCompanySummaryByEmail(email);
        return ResponseEntity.ok(response);
    }


    // 본인 정보 조회
    @GetMapping("/business/account/me")
    public ResponseEntity<BusinessProfileResponse> getMyProfile(Authentication authentication) {
        String email = extractEmail(authentication);
        BusinessProfileResponse response = businessProfileService.getMyProfileByEmail(email);
        return ResponseEntity.ok(response);
    }

    // 가입자 정보 수정 (이름, 전화번호, 지역, 상세주소)
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

    // 사업자 정보 수정 (회사명, 설립일, 사업자등록번호, 회사 번호, 사업장 주소)
    @PatchMapping("/business/account/edit/company")
    public ResponseEntity<Void> editMyCompany(
            Authentication authentication,
            @RequestBody BusinessCompanyEditRequest request
            ) {
        String email = extractEmail(authentication);
        businessProfileService.editMyCompanyByEmail(email, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/business/account/delete")
    public ResponseEntity<Void> deleteMyAccount(
            Authentication authentication,
            @RequestBody BusinessDeleteRequest request
    ) {
        String email = extractEmail(authentication);
        businessProfileService.deleteMyAccountByEmail(email, request);
        return ResponseEntity.noContent().build();
    }

}
