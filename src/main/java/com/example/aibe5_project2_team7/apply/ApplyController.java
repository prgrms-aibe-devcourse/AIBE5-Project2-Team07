package com.example.aibe5_project2_team7.apply;

import com.example.aibe5_project2_team7.apply.dto.ApplyDto;
import com.example.aibe5_project2_team7.apply.dto.ApplyRequestDto;
import com.example.aibe5_project2_team7.apply.dto.ApplyResponseDto;
import com.example.aibe5_project2_team7.apply.dto.OfferRequestDto;
import com.example.aibe5_project2_team7.apply.entity.ApplyStatus;
import com.example.aibe5_project2_team7.apply.entity.ApplyType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/applies")
public class ApplyController {

    private final ApplyService applyService;

    // 지원 / 제의 생성

    // 개인회원이 공고 지원
    @PostMapping("/apply")
    public ResponseEntity<ApplyResponseDto> applyForRecruit(
            @RequestHeader(name = "X-Member-Id", required = false) Long memberId,
            @RequestBody @Valid ApplyRequestDto requestDto
    ) {
        return ResponseEntity.ok(applyService.applyForRecruit(memberId, requestDto));
    }

    // 사업자회원이 개인회원에게 제의
    @PostMapping("/offer")
    public ResponseEntity<ApplyResponseDto> offerToIndividual(
            @RequestHeader(name = "X-Business-Profile-Id", required = false) Long businessProfileId,
            @RequestBody @Valid OfferRequestDto requestDto
    ) {
        return ResponseEntity.ok(applyService.offerForIndividual(businessProfileId, requestDto));
    }

    // 지원/제의 현황 목록 (PENDING 중심)
    // 개인 — 내가 한 지원 목록
    @GetMapping("/personal/applications")
    public ResponseEntity<Page<ApplyDto>> getMyApplications(
            @RequestHeader(name = "X-Member-Id") Long memberId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(applyService.getMyApplications(memberId, pageable));
    }

    // 개인 — 받은 제의 목록
    @GetMapping("/personal/offers")
    public ResponseEntity<Page<ApplyDto>> getOffersReceived(
            @RequestHeader(name = "X-Member-Id") Long memberId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(applyService.getOffersReceived(memberId, pageable));
    }

    // 사업자 — 보낸 제의 목록 (?recruitId=, 없으면 전체)
    @GetMapping("/business/offers")
    public ResponseEntity<Page<ApplyDto>> getOffersSentByBusiness(
            @RequestHeader(name = "X-Business-Profile-Id") Long businessProfileId,
            @RequestParam(required = false) Long recruitId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(applyService.getOffersSentByBusiness(businessProfileId, recruitId, pageable));
    }

    // 사업자 — 받은 지원 목록 (?recruitId=, 없으면 전체)
    @GetMapping("/business/applications")
    public ResponseEntity<Page<ApplyDto>> getApplicationsReceivedByBusiness(
            @RequestHeader(name = "X-Business-Profile-Id") Long businessProfileId,
            @RequestParam(required = false) Long recruitId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(applyService.getApplicationsReceivedByBusiness(businessProfileId, recruitId, pageable));
    }

    // 근무 관리 (ACCEPTED)
    // 개인 — 근무 관리 (?type=APPLY|OFFER, 없으면 전체)
    @GetMapping("/personal/works")
    public ResponseEntity<Page<ApplyDto>> getPersonalWorks(
            @RequestHeader(name = "X-Member-Id") Long memberId,
            @RequestParam(required = false) ApplyType type,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(applyService.getAppliesByIndividual(memberId, ApplyStatus.ACCEPTED, type, pageable));
    }

    // 사업자 — 근무 관리 (?type=APPLY|OFFER&recruitId=, 없으면 전체)
    @GetMapping("/business/works")
    public ResponseEntity<Page<ApplyDto>> getBusinessWorks(
            @RequestHeader(name = "X-Business-Profile-Id") Long businessProfileId,
            @RequestParam(required = false) ApplyType type,
            @RequestParam(required = false) Long recruitId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(applyService.getAppliesByBusiness(businessProfileId, ApplyStatus.ACCEPTED, type, recruitId, pageable));
    }

    // 리뷰 관리 (COMPLETED)
    // 개인 — 리뷰 관리 (?type=APPLY|OFFER, 없으면 전체)
    @GetMapping("/personal/reviews")
    public ResponseEntity<Page<ApplyDto>> getPersonalReviews(
            @RequestHeader(name = "X-Member-Id") Long memberId,
            @RequestParam(required = false) ApplyType type,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(applyService.getAppliesByIndividual(memberId, ApplyStatus.COMPLETED, type, pageable));
    }

    // 사업자 — 리뷰 관리 (?type=APPLY|OFFER&recruitId=, 없으면 전체)
    @GetMapping("/business/reviews")
    public ResponseEntity<Page<ApplyDto>> getBusinessReviews(
            @RequestHeader(name = "X-Business-Profile-Id") Long businessProfileId,
            @RequestParam(required = false) ApplyType type,
            @RequestParam(required = false) Long recruitId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(applyService.getAppliesByBusiness(businessProfileId, ApplyStatus.COMPLETED, type, recruitId, pageable));
    }


    // 상태 변경
    // 수락 / 거절 (PENDING → ACCEPTED | REJECTED)
    @PatchMapping("/{applyId}/decision")
    public ResponseEntity<?> decideApply(
            @RequestHeader(name = "X-Member-Id", required = false) Long memberId,
            @RequestHeader(name = "X-Business-Profile-Id", required = false) Long businessProfileId,
            @PathVariable Long applyId,
            @RequestBody @Valid DecisionRequest request
    ) {
        applyService.updateApply(applyId, request.getAccept(), memberId, businessProfileId);
        String message = request.getAccept() ? "수락 처리되었습니다." : "거절 처리되었습니다.";
        return ResponseEntity.ok(Map.of("message", message));
    }

    // 근무 완료 처리 (ACCEPTED → COMPLETED) — 사업자만
    @PatchMapping("/{applyId}/complete")
    public ResponseEntity<?> completeApply(
            @RequestHeader(name = "X-Business-Profile-Id") Long businessProfileId,
            @PathVariable Long applyId
    ) {
        applyService.completeApply(applyId, businessProfileId);
        return ResponseEntity.ok(Map.of("message", "근무완료 처리되었습니다."));
    }

    // 취소 (DB 삭제)
    // 지원/제의/근무 취소
    @DeleteMapping("/{applyId}")
    public ResponseEntity<?> cancelApply(
            @RequestHeader(name = "X-Member-Id", required = false) Long memberId,
            @RequestHeader(name = "X-Business-Profile-Id", required = false) Long businessProfileId,
            @PathVariable Long applyId
    ) {
        if (memberId == null && businessProfileId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "인증 정보가 없습니다."));
        }
        applyService.cancelApply(applyId, memberId, businessProfileId);
        return ResponseEntity.ok(Map.of("message", "취소되었습니다."));
    }

    public static class DecisionRequest {
        @NotNull
        private Boolean accept;

        public Boolean getAccept() {
            return accept;
        }

        public void setAccept(Boolean accept) {
            this.accept = accept;
        }
    }
}
