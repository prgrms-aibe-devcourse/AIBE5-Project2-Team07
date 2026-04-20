package com.example.aibe5_project2_team7.apply;

import com.example.aibe5_project2_team7.apply.dto.ApplyRequestDto;
import com.example.aibe5_project2_team7.apply.dto.ApplyResponseDto;
import com.example.aibe5_project2_team7.apply.dto.OfferRequestDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
