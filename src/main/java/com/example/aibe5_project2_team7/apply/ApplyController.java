package com.example.aibe5_project2_team7.apply;

import com.example.aibe5_project2_team7.apply.dto.ApplyDto;
import com.example.aibe5_project2_team7.apply.dto.ApplyRequestDto;
import com.example.aibe5_project2_team7.apply.dto.ApplyResponseDto;
import com.example.aibe5_project2_team7.apply.dto.OfferRequestDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/applies")
public class ApplyController {
    private final ApplyService applyService;

    // 개인회원이 공고 온라인 지원
    @PostMapping("/apply")
    public ResponseEntity<ApplyResponseDto> applyForRecruit (
            @RequestHeader(name = "X-Member-Id", required = false) Long memberId,
            @RequestBody @Valid ApplyRequestDto requestDto
    ) {
        ApplyResponseDto responseDto = applyService.applyForRecruit(memberId, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    // 사업자회원이 개인회원에게 제의
    @PostMapping("/offer")
    public ResponseEntity<ApplyResponseDto> offerToIndividual(
            @RequestHeader(name = "X-Business-Profile-Id", required = false) Long businessProfileId,
            @RequestBody @Valid OfferRequestDto requestDto
    ) {
        ApplyResponseDto responseDto = applyService.offerForIndividual(businessProfileId, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    //지원/제의 취소
    @DeleteMapping("/{applyId}")
    public ResponseEntity<?> cancelApply(
            @RequestHeader(name="X-Member-Id", required = false) Long memberId,
            @RequestHeader(name="X-Business-Profile-Id", required = false) Long businessProfileId,
            @PathVariable Long applyId
    ) {
        if (memberId == null && businessProfileId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "인증 정보가 없습니다."));
        }
        applyService.cancelApply(applyId, memberId, businessProfileId);
        return ResponseEntity.ok(Map.of("message", "철회되었습니다."));
    }

    //개인이 한 지원 목록(페이징)
    @GetMapping("/personal/applications")
    public ResponseEntity<Page<ApplyDto>> getOffersRecived(
            @RequestHeader(name = "X-Member-Id") Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<ApplyDto> result = applyService.getMyApplications(memberId, page, size);
        return ResponseEntity.ok(result);
    }

    //개인이 받은 제의 목록(페이징)
    @GetMapping("/personal/offers")
    public ResponseEntity<Page<ApplyDto>> getOffersReceived(
            @RequestHeader(name = "X-Member-Id") Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<ApplyDto> result = applyService.getOffersReceived(memberId, page, size);
        return ResponseEntity.ok(result);
    }

    //사업자가 보낸 제의 목록(페이징)
    @GetMapping("/business/offers")
    public ResponseEntity<Page<ApplyDto>> getOffersSentByBusiness(
            @RequestHeader(name = "X-Business-Profile-Id") Long businessProfileId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<ApplyDto> result = applyService.getOffersSentByBusiness(businessProfileId, page, size);
        return ResponseEntity.ok(result);
    }

    // 사업자가 받은 지원 목록(페이징)
    @GetMapping("/business/applications/received")
    public ResponseEntity<Page<ApplyDto>> getApplicationsReceivedByBusiness(
            @RequestHeader(name="X-Business-Profile-Id") Long businessProfileId,
            @RequestParam(required = false) Long recruitId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<ApplyDto> result = applyService.getApplicationsReceivedByBusiness(businessProfileId, recruitId, page, size);
        return ResponseEntity.ok(result);
    }

    // 제의/지원 수락 or 거절하기
    @PatchMapping("/{applyId}/decision")
    public ResponseEntity<?> decideApply(
            @RequestHeader(name = "X-Member-Id", required = false) Long memberId,
            @RequestHeader(name = "X-Business-Profile-Id", required = false) Long businessProfileId,
            @PathVariable Long applyId,
            @RequestBody @Valid DecisionRequest request
    ) {
        boolean accept = request.getAccept();
        applyService.updateApply(applyId, accept, memberId, businessProfileId);
        String message = accept ? "수락 처리되었습니다." : "거절 처리되었습니다.";
        return ResponseEntity.ok(Map.of("message", message));
    }

    public static class DecisionRequest {
        @NotNull
        private Boolean accept; //true 수락 false 거절

        public Boolean getAccept() {return accept;}
        public void setAccept(Boolean accept) { this.accept = accept; }
    }
}
