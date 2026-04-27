package com.example.aibe5_project2_team7.member.service;

import com.example.aibe5_project2_team7.member.Gender;
import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.MemberType;
import com.example.aibe5_project2_team7.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final MemberService memberService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        if (!"kakao".equals(registrationId)) {
            return oAuth2User;
        }

        Map<String, Object> attributes = oAuth2User.getAttributes();
        String kakaoId = extractKakaoId(attributes);
        if (kakaoId == null || kakaoId.isBlank() || "unknown".equals(kakaoId)) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("invalid_user_info"),
                    "Kakao account id is required"
            );
        }
        String phoneKey = buildKakaoPhoneKey(kakaoId);
        String email = normalizeEmail(extractEmail(attributes), kakaoId);

        String nickname = extractNickname(attributes);
        String profileImage = extractProfileImage(attributes);

        Optional<Member> byPhone = memberRepository.findByPhone(phoneKey);
        Member member = byPhone
                .or(() -> memberRepository.findByEmail(email))
                .map(existing -> updateExisting(existing, nickname, profileImage))
                .orElseGet(() -> createNewKakaoMember(email, nickname, profileImage, kakaoId, phoneKey));

        Map<String, Object> mapped = new HashMap<>(attributes);
        mapped.put("email", member.getEmail());
        mapped.put("memberType", member.getMemberType().name());
        mapped.put("memberId", member.getId());

        return new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                mapped,
                "email"
        );
    }

    private Member createNewKakaoMember(String email, String nickname, String profileImage, String kakaoId, String phoneKey) {
        Member member = new Member();
        member.setName((nickname == null || nickname.isBlank()) ? "kakao_" + kakaoId : nickname);
        member.setEmail(email);
        member.setImage(profileImage);
        member.setBirthDate(LocalDate.of(1970, 1, 1));
        member.setGender(Gender.MALE);
        member.setMemberType(MemberType.INDIVIDUAL);
        member.setRatingSum(0);
        member.setRatingCount(0);
        member.setPassword(UUID.randomUUID().toString());
        member.setPhone(phoneKey);
        return memberService.registerMember(member, null);
    }

    private String normalizeEmail(String rawEmail, String kakaoId) {
        if (rawEmail != null && !rawEmail.isBlank()) {
            return rawEmail;
        }
        return "kakao_" + kakaoId + "@no-email.local";
    }

    private String buildKakaoPhoneKey(String kakaoId) {
        return "KAKAO-" + kakaoId;
    }

    private Member updateExisting(Member existing, String nickname, String profileImage) {
        boolean changed = false;
        if (nickname != null && !nickname.isBlank() && !nickname.equals(existing.getName())) {
            existing.setName(nickname);
            changed = true;
        }
        if (profileImage != null && !profileImage.isBlank() && !profileImage.equals(existing.getImage())) {
            existing.setImage(profileImage);
            changed = true;
        }
        return changed ? memberRepository.save(existing) : existing;
    }

    private String extractEmail(Map<String, Object> attributes) {
        Object accountObj = attributes.get("kakao_account");
        if (!(accountObj instanceof Map<?, ?> account)) {
            return null;
        }
        Object email = account.get("email");
        return email == null ? null : email.toString();
    }

    private String extractNickname(Map<String, Object> attributes) {
        Object propertiesObj = attributes.get("properties");
        if (propertiesObj instanceof Map<?, ?> properties) {
            Object nickname = properties.get("nickname");
            if (nickname != null && !nickname.toString().isBlank()) {
                return nickname.toString();
            }
        }

        Object accountObj = attributes.get("kakao_account");
        if (!(accountObj instanceof Map<?, ?> account)) {
            return null;
        }
        Object profileObj = account.get("profile");
        if (!(profileObj instanceof Map<?, ?> profile)) {
            return null;
        }
        Object nickname = profile.get("nickname");
        return nickname == null ? null : nickname.toString();
    }

    private String extractProfileImage(Map<String, Object> attributes) {
        Object propertiesObj = attributes.get("properties");
        if (propertiesObj instanceof Map<?, ?> properties) {
            Object image = properties.get("profile_image");
            if (image != null && !image.toString().isBlank()) {
                return image.toString();
            }
        }

        Object accountObj = attributes.get("kakao_account");
        if (!(accountObj instanceof Map<?, ?> account)) {
            return null;
        }
        Object profileObj = account.get("profile");
        if (!(profileObj instanceof Map<?, ?> profile)) {
            return null;
        }
        Object image = profile.get("profile_image_url");
        return image == null ? null : image.toString();
    }

    private String extractKakaoId(Map<String, Object> attributes) {
        Object id = attributes.get("id");
        return id == null ? "unknown" : id.toString();
    }
}

