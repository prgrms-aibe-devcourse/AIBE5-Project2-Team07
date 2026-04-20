package com.example.aibe5_project2_team7.apply.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ApplyRequestDto {
    private Long resumeId;
    private Long recruitId;
    private String method;
    private String message;
    private String attachedFileUrl;
    private Boolean agree; //필수, true여야 함
}
