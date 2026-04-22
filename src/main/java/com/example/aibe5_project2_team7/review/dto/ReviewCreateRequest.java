package com.example.aibe5_project2_team7.review.dto;

import com.example.aibe5_project2_team7.review.ReviewTargetType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReviewCreateRequest {

    @NotNull
    private Long targetId;

    @NotNull
    private ReviewTargetType targetType;

    @NotNull
    private Long applyId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    private String content;

    @NotEmpty
    private List<String> labelNames;
}