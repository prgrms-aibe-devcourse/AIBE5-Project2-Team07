package com.example.aibe5_project2_team7.recruit.dto;

import com.example.aibe5_project2_team7.recruit.constant.RecruitStatus;
import lombok.Getter;

@Getter
public class RecruitStatusUpdateDto {
    private RecruitStatus status; // OPEN, CLOSED, EXPIRED
}
