package com.example.aibe5_project2_team7.apply.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OfferRequestDto {
    @NotNull
    private Long recruitId;

    @NotNull
    private Long individualProfileId;

    private String message;
    private String attachedFileUrl;
}
