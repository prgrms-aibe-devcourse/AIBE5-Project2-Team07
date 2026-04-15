package com.example.aibe5_project2_team7.member.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

import com.example.aibe5_project2_team7.member.MemberType;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret:}")
    private String secretBase64;

    private Key key;
    private final long expirationTime = 86400000L; // 1 day

    @PostConstruct
    public void init() {
        if (secretBase64 == null || secretBase64.isBlank()) {
            log.warn("No jwt.secret provided — generating random key (tokens won't survive restarts)");
            this.key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
            return;
        }

        try {
            byte[] decoded = Base64.getDecoder().decode(secretBase64);
            this.key = Keys.hmacShaKeyFor(decoded);
        } catch (IllegalArgumentException e) {
            // invalid base64 input
            log.warn("Invalid jwt.secret provided — must be Base64. Falling back to generated key. Error: {}", e.getMessage());
            this.key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
        }
    }

    public String generateToken(String email, MemberType memberType) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationTime);
        io.jsonwebtoken.JwtBuilder builder = Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key);
        if (memberType != null) {
            builder.claim("type", memberType.name());
        }
        return builder.compact();
    }

    public String extractEmail(String token) {
        Claims claims = getClaims(token);
        return claims != null ? claims.getSubject() : null;
    }


    public boolean isTokenValid(String token, String email) {
        String tokenEmail = extractEmail(token);
        if (tokenEmail == null) return false;
        return tokenEmail.equals(email) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Claims claims = getClaims(token);
        if (claims == null) return true;
        Date exp = claims.getExpiration();
        return exp == null || exp.before(new Date());
    }

    private Claims getClaims(String token) {
        try {
            Jws<Claims> jws = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return jws.getBody();
        } catch (ExpiredJwtException e) {
            // 토큰이 만료됨
            return e.getClaims();
        } catch (SignatureException | MalformedJwtException | IllegalArgumentException e) {
            // 서명 불일치 or 형식 오류
            return null;
        }
    }
}