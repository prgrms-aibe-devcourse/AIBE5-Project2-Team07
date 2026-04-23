package com.example.aibe5_project2_team7.apply.dto;

import lombok.Getter;

@Getter
public class ApplyResponseDto {
    private Long applyId;
    private String message; //"지원이 완료되었습니다."

    public ApplyResponseDto(Long applyId, String message) {
        this.applyId = applyId;
        this.message = message;
    }
}
