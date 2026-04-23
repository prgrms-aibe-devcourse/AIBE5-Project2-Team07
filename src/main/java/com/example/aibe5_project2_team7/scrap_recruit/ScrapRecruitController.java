package com.example.aibe5_project2_team7.scrap_recruit;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;

@RestController
@RequiredArgsConstructor
@RequestMapping("/scraps/recruits")
public class ScrapRecruitController {
    private final ScrapRecruitService scrapRecruitService;

    // 스크랩 추가
    @PostMapping("/{recruitId}")
    public ResponseEntity<Void> addScrap(
            @PathVariable Long recruitId,
            @RequestHeader(name = "X-Member-Id", defaultValue = "1") Long memberId
    ) {
        scrapRecruitService.addScrapRecruit(memberId, recruitId);
        return ResponseEntity.ok().build();
    }

    // 스크랩 취소
    @DeleteMapping("/{recruitId}")
    public ResponseEntity<Void> removeScrap(
            @PathVariable Long recruitId,
            @RequestHeader(name = "X-Member-Id", defaultValue = "1") Long memberId
    ) {
        scrapRecruitService.removeScrapRecruit(memberId, recruitId);
        return ResponseEntity.noContent().build();
    }

    // 스크랩 목록 조회 (페이지)
    @GetMapping
    public ResponseEntity<Page<ScrapRecruitResponse>> getScrapRecruitList(
            @RequestHeader(name = "X-Member-Id", defaultValue = "1") Long memberId,
            @RequestParam(name = "page", defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(scrapRecruitService.getMyScrapRecruitList(memberId, page));
    }

    // 스크랩 개수 조회
    @GetMapping("/count")
    public ResponseEntity<Long> countScrapRecruit(
            @RequestHeader(name = "X-Member-Id", defaultValue = "1") Long memberId
    ) {
        return ResponseEntity.ok(scrapRecruitService.countMyScrap(memberId));
    }
}