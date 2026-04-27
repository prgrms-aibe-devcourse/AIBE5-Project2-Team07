package com.example.aibe5_project2_team7.review.dto;

import com.example.aibe5_project2_team7.review.Review;
import com.example.aibe5_project2_team7.review.ReviewTargetType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ReviewResponse {

    private Long id;
    private Long writerId;
    private String writerName;
    private String companyName;
    private Long targetId;
    private ReviewTargetType targetType;
    private Long applyId;
    private Integer rating;
    private String content;
    private LocalDateTime writtenAt;
    private List<ReviewLabelResponse> labels;

    public static ReviewResponse from(Review review, String writerName, String companyName) {
        return ReviewResponse.builder()
                .id(review.getId())
                .writerId(review.getWriterId())
                .writerName(writerName)
                .companyName(companyName)
                .targetId(review.getTargetId())
                .targetType(review.getTargetType())
                .applyId(review.getApplyId())
                .rating(review.getRating())
                .content(review.getContent())
                .writtenAt(review.getWrittenAt())
                .labels(
                        review.getLabels().stream()
                                .map(ReviewLabelResponse::from)
                                .toList()
                )
                .build();
    }
}