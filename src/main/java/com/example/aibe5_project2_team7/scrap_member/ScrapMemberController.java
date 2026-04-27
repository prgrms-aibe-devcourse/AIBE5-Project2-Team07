package com.example.aibe5_project2_team7.scrap_member;

import com.example.aibe5_project2_team7.individual_profile.IndividualProfile;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfileRepository;
import com.example.aibe5_project2_team7.resume.dto.ResumeSummaryDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/scraps/members")
public class ScrapMemberController {
    private final ScrapMemberService scrapMemberService;
    private final IndividualProfileRepository individualProfileRepository;
    private final ScrapMemberRepository scrapMemberRepository;

    // 스크랩 추가 (individualProfileId 직접 사용)
    @PostMapping("/{individualProfileId}")
    public ResponseEntity<Void> addScrapMember(
            @PathVariable Long individualProfileId,
            @RequestHeader(name = "X-Business-Profile-Id", defaultValue = "1") Long businessProfileId
    ) {
        scrapMemberService.addScrapMember(businessProfileId, individualProfileId);
        return ResponseEntity.ok().build();
    }

    // 스크랩 추가 (memberId로 스크랩 — TalentProfilePage에서 사용)
    @PostMapping("/by-member/{memberId}")
    public ResponseEntity<Void> addScrapMemberByMemberId(
            @PathVariable Long memberId,
            @RequestHeader(name = "X-Business-Profile-Id", defaultValue = "1") Long businessProfileId
    ) {
        IndividualProfile profile = individualProfileRepository.findByMemberId(memberId)
                .orElseThrow(() -> new EntityNotFoundException("해당 회원의 IndividualProfile을 찾을 수 없습니다."));
        scrapMemberService.addScrapMember(businessProfileId, profile.getId());
        return ResponseEntity.ok().build();
    }

    // 스크랩 여부 확인 (memberId로 — 프론트 isScrap 상태 초기화용)
    @GetMapping("/by-member/{memberId}/exists")
    public ResponseEntity<Boolean> isScrapByMemberId(
            @PathVariable Long memberId,
            @RequestHeader(name = "X-Business-Profile-Id", defaultValue = "1") Long businessProfileId
    ) {
        IndividualProfile profile = individualProfileRepository.findByMemberId(memberId).orElse(null);
        if (profile == null) return ResponseEntity.ok(false);
        boolean exists = scrapMemberRepository.existsByBusinessProfileIdAndIndividualProfileId(
                businessProfileId, profile.getId());
        return ResponseEntity.ok(exists);
    }

    // 스크랩 취소
    @DeleteMapping("/{individualProfileId}")
    public ResponseEntity<Void> removeScrapMember(
            @PathVariable Long individualProfileId,
            @RequestHeader(name = "X-Business-Profile-Id", defaultValue = "1") Long businessProfileId
    ) {
        scrapMemberService.removeScrapMember(businessProfileId, individualProfileId);
        return ResponseEntity.noContent().build();
    }

    // 스크랩 취소 (memberId로 — TalentProfilePage에서 사용)
    @DeleteMapping("/by-member/{memberId}")
    public ResponseEntity<Void> removeScrapMemberByMemberId(
            @PathVariable Long memberId,
            @RequestHeader(name = "X-Business-Profile-Id", defaultValue = "1") Long businessProfileId
    ) {
        IndividualProfile profile = individualProfileRepository.findByMemberId(memberId)
                .orElseThrow(() -> new EntityNotFoundException("해당 회원의 IndividualProfile을 찾을 수 없습니다."));
        scrapMemberService.removeScrapMember(businessProfileId, profile.getId());
        return ResponseEntity.noContent().build();
    }

    // 스크랩 목록 조회
    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<ResumeSummaryDto>> getScrapMemberList(
            @RequestHeader(name = "X-Business-Profile-Id", defaultValue = "1") Long businessProfileId,
            @RequestParam(name = "page", defaultValue = "0") int page
    ) {
        // size는 서버에서 고정(20)
        return ResponseEntity.ok(scrapMemberService.getScrapMemberList(businessProfileId, page));
    }

    // 스크랩 개수 조회
    @GetMapping("/count")
    public ResponseEntity<Long> countScrapMember(
            @RequestHeader(name = "X-Business-Profile-Id", defaultValue = "1") Long businessProfileId
    ) {
        return ResponseEntity.ok(scrapMemberService.countScrapMember(businessProfileId));
    }
}
