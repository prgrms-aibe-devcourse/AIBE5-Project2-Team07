package com.example.aibe5_project2_team7.review;

import com.example.aibe5_project2_team7.member.CustomUser;
import com.example.aibe5_project2_team7.review.dto.ReviewCreateRequest;
import com.example.aibe5_project2_team7.review.dto.ReviewResponse;
import com.example.aibe5_project2_team7.review.dto.ReviewUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 리뷰 생성
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse createReview(
            @AuthenticationPrincipal CustomUser user,
            @RequestBody @Valid ReviewCreateRequest request
    ) {
        return reviewService.createReview(user.getId(), request);
    }

    // 리뷰 수정
    @PatchMapping("/{reviewId}")
    public ReviewResponse updateReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUser user,
            @RequestBody @Valid ReviewUpdateRequest request
    ) {
        return reviewService.updateReview(reviewId, user.getId(), request);
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public Map<String, String> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUser user
    ) {
        reviewService.deleteReview(reviewId, user.getId());
        return Map.of("message", "리뷰가 삭제되었습니다.");
    }

    @GetMapping("/{reviewId}")
    public ReviewResponse getReview(@PathVariable Long reviewId) {
        return reviewService.getReview(reviewId);
    }

    @GetMapping("/target/{targetId}")
    public List<ReviewResponse> getReviewsByTarget(@PathVariable Long targetId) {
        return reviewService.getReviewsByTarget(targetId);
    }

    @GetMapping("/writer/{writerId}")
    public List<ReviewResponse> getReviewsByWriter(@PathVariable Long writerId) {
        return reviewService.getReviewsByWriter(writerId);
    }
}
