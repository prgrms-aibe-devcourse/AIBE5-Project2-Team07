package com.example.aibe5_project2_team7.member.controller;

import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.MemberType;
import com.example.aibe5_project2_team7.member.service.JwtUtil;
import com.example.aibe5_project2_team7.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Member member) {
        try {
            Member registeredMember = memberService.registerMember(member);
            return ResponseEntity.ok(Map.of("message", "Registration successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            String typeStr = credentials.get("memberType");
            MemberType requestedType = null;
            if (typeStr != null && !typeStr.isBlank()) {
                try {
                    requestedType = MemberType.valueOf(typeStr.toUpperCase());
                } catch (IllegalArgumentException ex) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid memberType"));
                }
            }

            Member member = memberService.authenticate(email, password);

            if (requestedType != null && member.getMemberType() != requestedType) {
                return ResponseEntity.badRequest().body(Map.of("error", "Member type mismatch"));
            }

            String token = jwtUtil.generateToken(email, member.getMemberType());
            return ResponseEntity.ok(Map.of("token", token, "member", member));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}