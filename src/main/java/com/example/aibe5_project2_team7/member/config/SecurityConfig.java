package com.example.aibe5_project2_team7.member.config;

import com.example.aibe5_project2_team7.member.CustomUser;
import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.repository.MemberRepository;
import com.example.aibe5_project2_team7.member.service.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**","/personal/**","/human-resource/**", "/business/**").permitAll()
                        .requestMatchers("/auth/**","/personal/**","/human-resource/**", "/api/brand/**").permitAll()
                        .requestMatchers("/auth/**", "/api/auth/**", "/personal/**", "/api/personal/**", "/human-resource/**", "/api/human-resource/**", "/recruits/**", "/api/recruits/**", "/business/**", "/api/business/**", "/business/myrecruit/**", "/api/business/myrecruit/**", "/scraps/**", "/api/scraps/**", "/scraps/members/**", "/api/scraps/members/**", "/scraps/recruits/**", "/api/scraps/recruits/**", "/applies/**", "/api/applies/**", "/api/regions/**", "/uploads/**", "/api/reviews/**").permitAll()
                        .requestMatchers("/api/chat/**", "/ws-connect/**", "/ws-connect").permitAll()
                        .requestMatchers("/api/personal/**","/api/human-resource/**", "/recruits/**", "/api/recruits/**", "/api/business/**", "/business/myrecruit/**", "/api/business/myrecruit/**", "/scraps/**", "/api/scraps/**", "/scraps/members/**", "/api/scraps/members/**", "/scraps/recruits/**", "/api/scraps/recruits/**", "/applies/**", "/api/applies/**", "/api/regions/**", "/uploads/**", "/api/reviews/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/human-resource/**").permitAll()
                        .requestMatchers( "/reviews/**","/applies/**","/applies/personal/**","/applies/business/**").permitAll()
                        .requestMatchers("/personal/**").authenticated()
                        .requestMatchers("/recommend/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        new JwtAuthenticationFilter(jwtUtil, memberRepository),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @RequiredArgsConstructor
    public static class JwtAuthenticationFilter extends OncePerRequestFilter {

        private final JwtUtil jwtUtil;
        private final MemberRepository memberRepository;

        @Override
        protected void doFilterInternal(
                HttpServletRequest request,
                HttpServletResponse response,
                FilterChain filterChain
        ) throws ServletException, IOException {

            String header = request.getHeader("Authorization");

            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);

                try {
                    String email = jwtUtil.extractEmail(token);

                    if (email != null && jwtUtil.isTokenValid(token, email)) {
                        Member member = memberRepository.findByEmail(email).orElse(null);

                        if (member != null) {
                            CustomUser customUser = new CustomUser(
                                    member.getId(),
                                    member.getEmail(),
                                    member.getPassword()
                            );

                            UsernamePasswordAuthenticationToken auth =
                                    new UsernamePasswordAuthenticationToken(
                                            customUser,
                                            null,
                                            customUser.getAuthorities()
                                    );

                            SecurityContextHolder.getContext().setAuthentication(auth);
                        }
                    }
                } catch (Exception e) {
                    // 필요 시 로그 남기기
                }
            }

            filterChain.doFilter(request, response);
        }
    }
}