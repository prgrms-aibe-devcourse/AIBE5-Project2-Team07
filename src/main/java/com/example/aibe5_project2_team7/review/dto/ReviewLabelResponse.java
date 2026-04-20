package com.example.aibe5_project2_team7.review.dto;

import com.example.aibe5_project2_team7.review.ReviewLabel;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReviewLabelResponse {

    private Long id;
    private String labelName;

    public static ReviewLabelResponse from(ReviewLabel reviewLabel) {
        return ReviewLabelResponse.builder()
                .id(reviewLabel.getId())
                .labelName(reviewLabel.getName())
                .build();
    }
}