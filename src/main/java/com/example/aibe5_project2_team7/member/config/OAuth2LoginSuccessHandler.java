package com.example.aibe5_project2_team7.member.config;

import com.example.aibe5_project2_team7.member.MemberType;
import com.example.aibe5_project2_team7.member.service.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    @Value("${app.oauth2.redirect-uri:http://localhost:5173/login/oauth2/callback}")
    private String redirectUri;

    @Value("${app.security.cookie.secure:false}")
    private boolean secureCookie;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();

        Object emailObj = principal.getAttributes().get("email");
        String email = emailObj == null ? null : emailObj.toString();
        if (email == null || email.isBlank()) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "OAuth2 email not found");
            return;
        }
        MemberType memberType = extractMemberType(principal);
        String token = jwtUtil.generateToken(email, memberType);

        Cookie cookie = new Cookie("access_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60);
        response.addCookie(cookie);

        response.sendRedirect(redirectUri);
    }

    private MemberType extractMemberType(OAuth2User principal) {
        Object rawType = principal.getAttributes().get("memberType");
        if (rawType == null) {
            return MemberType.INDIVIDUAL;
        }
        if (rawType instanceof MemberType type) {
            return type;
        }
        try {
            return MemberType.valueOf(rawType.toString());
        } catch (IllegalArgumentException ex) {
            return MemberType.INDIVIDUAL;
        }
    }
}

