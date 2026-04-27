package com.example.aibe5_project2_team7.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReviewUpdateRequest {

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    private String content;

    @NotEmpty
    private List<String> labelNames;
}