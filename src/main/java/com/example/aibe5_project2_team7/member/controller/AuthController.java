package com.example.aibe5_project2_team7.member.controller;

import com.example.aibe5_project2_team7.member.CustomUser;
import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.MemberType;
import com.example.aibe5_project2_team7.member.service.JwtUtil;
import com.example.aibe5_project2_team7.member.service.MemberService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    @Value("${app.security.cookie.secure:false}")
    private boolean secureCookie;

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
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletResponse response) {
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
            addAccessTokenCookie(response, token);
            return ResponseEntity.ok(Map.of("token", token, "member", member));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        clearAccessTokenCookie(response);
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        Object principal = authentication.getPrincipal();
        String email = null;

        if (principal instanceof CustomUser customUser) {
            email = customUser.getUsername();
        } else if (principal instanceof UserDetails userDetails) {
            email = userDetails.getUsername();
        } else if (principal instanceof String principalStr) {
            email = principalStr;
        }

        if (email == null || email.isBlank() || "anonymousUser".equals(email)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        try {
            Member member = memberService.findByEmail(email);
            return ResponseEntity.ok(Map.of("member", member));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
        }
    }

    private void addAccessTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("access_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60);
        response.addCookie(cookie);
    }

    private void clearAccessTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("access_token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}