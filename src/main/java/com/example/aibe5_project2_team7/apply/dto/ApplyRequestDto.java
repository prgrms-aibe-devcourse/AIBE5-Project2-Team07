package com.example.aibe5_project2_team7.apply.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ApplyRequestDto {
    private Long resumeId;
    @NotNull
    private Long recruitId;
    private String method;
    private String message;
    private String attachedFileUrl;
    @AssertTrue(message = "개인정보 활용에 동의해야 합니다.")
    private Boolean agree; //필수, true여야 함
}
