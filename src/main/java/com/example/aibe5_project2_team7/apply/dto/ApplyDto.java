package com.example.aibe5_project2_team7.apply.dto;

import com.example.aibe5_project2_team7.apply.entity.ApplyMethod;
import com.example.aibe5_project2_team7.apply.entity.ApplyStatus;
import com.example.aibe5_project2_team7.apply.entity.ApplyType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
public class ApplyDto {
    private Long id;
    private Long individualId;
    private Long recruitId;
    private ApplyType type;
    private ApplyStatus status;
    private String message;
    private String attachedFileUrl;
    private LocalDateTime createdAt;
    private Long resumeId;
    private ApplyMethod method;
}
