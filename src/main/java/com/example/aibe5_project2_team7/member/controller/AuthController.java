package com.example.aibe5_project2_team7.member.controller;

import com.example.aibe5_project2_team7.business_profile.BusinessProfile;
import com.example.aibe5_project2_team7.business_profile.BusinessProfileRepository;
import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.MemberType;
import com.example.aibe5_project2_team7.member.service.JwtUtil;
import com.example.aibe5_project2_team7.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;
    private final BusinessProfileRepository businessProfileRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> payload) {
        try {

            Member member = new Member();
            member.setName((String) payload.get("name"));
            member.setEmail((String) payload.get("email"));
            member.setPhone((String) payload.get("phone"));
            member.setPassword((String) payload.get("password"));
            Object birth = payload.get("birthDate");
            if (birth != null) member.setBirthDate(LocalDate.parse(birth.toString()));
            Object gender = payload.get("gender");
            if (gender != null) member.setGender(com.example.aibe5_project2_team7.member.Gender.valueOf(gender.toString()));
            Object type = payload.get("memberType");
            if (type != null) member.setMemberType(MemberType.valueOf(type.toString()));

            member.setImage((String) payload.getOrDefault("image", null));
            member.setRatingSum(Integer.parseInt(payload.getOrDefault("ratingSum", 0).toString()));
            member.setRatingCount(Integer.parseInt(payload.getOrDefault("ratingCount", 0).toString()));

            Map<String, Object> businessExtra = null;
            if (member.getMemberType() == MemberType.BUSINESS) {
                Object be = payload.get("businessProfile");
                if (be instanceof Map) {

                    businessExtra = (Map<String, Object>) be;
                } else {
                    return ResponseEntity.badRequest().body(Map.of("error", "businessProfile data required for BUSINESS registration"));
                }
            }

            Member registered = memberService.registerMember(member, businessExtra);
            return ResponseEntity.ok(Map.of("message", "Registration successful", "memberId", registered.getId()));
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

            Map<String, Object> memberResponse = new LinkedHashMap<>();

            memberResponse.put("id", member.getId());
            memberResponse.put("name", member.getName());
            memberResponse.put("email", member.getEmail());
            memberResponse.put("phone", member.getPhone());
            memberResponse.put("birthDate", member.getBirthDate());
            memberResponse.put("gender", member.getGender());
            memberResponse.put("image", member.getImage());
            memberResponse.put("memberType", member.getMemberType());
            memberResponse.put("ratingSum", member.getRatingSum());
            memberResponse.put("ratingCount", member.getRatingCount());

            if (member.getMemberType() == MemberType.BUSINESS) {
                businessProfileRepository.findByMemberId(member.getId())
                        .ifPresent(profile -> {
                            memberResponse.put("businessProfileId", profile.getId());
                        });
            }

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "member", memberResponse
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}