package com.example.aibe5_project2_team7.scrap_member;

import com.example.aibe5_project2_team7.resume.dto.ResumeSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/scraps/members")
public class ScrapMemberController {
    private final ScrapMemberService scrapMemberService;

    // 스크랩 추가
    @PostMapping("/{individualProfileId}")
    public ResponseEntity<Void> addScrapMember(
            @PathVariable Long individualProfileId,
            @RequestHeader(name = "X-Business-Profile-Id", defaultValue = "1") Long businessProfileId
    ) {
        scrapMemberService.addScrapMember(businessProfileId, individualProfileId);
        return ResponseEntity.ok().build();
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
