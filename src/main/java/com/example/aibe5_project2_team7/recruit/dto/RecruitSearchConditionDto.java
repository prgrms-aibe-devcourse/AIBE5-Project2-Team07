package com.example.aibe5_project2_team7.recruit.dto;


import com.example.aibe5_project2_team7.recruit.constant.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class RecruitSearchConditionDto {
    private String type;                    // ALL / SHORT / LONG
    private String keyword;                 // 검색어
    private List<Integer> regionId;         // 지역 ID 목록 (OR)
    private List<LocalDate> workDate;       // 근무 일자 목록 (type=SHORT 일 때만 유효, OR)
    private List<Period> workPeriod;        // 근무 기간 필터
    private List<Times> workTime;           // 근무 시간 필터
    private List<Days> workDays;            // 근무 요일 필터
    private List<BusinessTypeName> businessType; // 업종 필터
    private String sort;                    // LATEST / DEADLINE
    private Long memberId;                  // 특정 사업자 회원 ID 필터
    private boolean isUrgent;               // 긴급 여부 필터
}
