package com.example.aibe5_project2_team7.member.controller;

import com.example.aibe5_project2_team7.member.CustomUser;
import com.example.aibe5_project2_team7.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/personal")
@RequiredArgsConstructor
public class MemberController {
    // 개인회원 관련 API
    private final MemberService memberService;

    // 회원 탈퇴
    @DeleteMapping("/account")
    public ResponseEntity<?> deleteAccount(
            @AuthenticationPrincipal CustomUser user
    ){
        try{
            memberService.deleteMember(user.getId());
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 회원 정보 수정
    @PatchMapping("/account")
    public ResponseEntity<?> updateAccount(
            @AuthenticationPrincipal CustomUser user,
            @RequestBody Map<String, Object> updates){
        try{
            memberService.updateMember(user.getId(), updates);
            return ResponseEntity.ok("회원 정보 수정 완료");
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
