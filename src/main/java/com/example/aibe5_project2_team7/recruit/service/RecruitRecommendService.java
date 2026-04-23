package com.example.aibe5_project2_team7.recruit.service;

import com.example.aibe5_project2_team7.naverapi.service.NaverMapService;
import com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName;
import com.example.aibe5_project2_team7.recruit.constant.Days;
import com.example.aibe5_project2_team7.recruit.constant.Period;
import com.example.aibe5_project2_team7.recruit.constant.Times;
import com.example.aibe5_project2_team7.recruit.dto.RecruitRecommendConditionRequestDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitRecommendResponseDto;
import com.example.aibe5_project2_team7.recruit.entity.*;
import com.example.aibe5_project2_team7.recruit.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecruitRecommendService {

    private final RecruitRecommendRepository recruitRecommendRepository;
    private final WorkPeriodRepository workPeriodRepository;
    private final WorkDaysRepository workDaysRepository;
    private final WorkTimeRepository workTimeRepository;
    private final BusinessTypeRepository businessTypeRepository;
    private final NaverMapService naverMapService;
    public List<RecruitRecommendResponseDto> getRecommendList(RecruitRecommendConditionRequestDto condition) {

        // 1) 추천 순위 계산 + recruit 본문 20개 조회
        List<Recruit> recruits = recruitRecommendRepository.getRecommendFieldSearch(condition);

        if (recruits.isEmpty()) {
            return List.of();
        }

        // 2) 추천 결과 id 목록 추출
        List<Long> recruitIds = recruits.stream()
                .map(Recruit::getId)
                .toList();

        // 3) 자식 테이블들 IN 조회
        Map<Long, List<Period>> workPeriodMap = workPeriodRepository.findByRecruitIdIn(recruitIds).stream()
                .collect(Collectors.groupingBy(
                        wp -> wp.getRecruit().getId(),
                        Collectors.mapping(WorkPeriod::getPeriod, Collectors.toList())
                ));

        Map<Long, List<Days>> workDaysMap = workDaysRepository.findByRecruitIdIn(recruitIds).stream()
                .collect(Collectors.groupingBy(
                        wd -> wd.getRecruit().getId(),
                        Collectors.mapping(WorkDays::getDay, Collectors.toList())
                ));

        Map<Long, List<Times>> workTimeMap = workTimeRepository.findByRecruitIdIn(recruitIds).stream()
                .collect(Collectors.groupingBy(
                        wt -> wt.getRecruit().getId(),
                        Collectors.mapping(WorkTime::getTimes, Collectors.toList())
                ));

        Map<Long, List<BusinessTypeName>> businessTypeMap = businessTypeRepository.findByRecruitIdIn(recruitIds).stream()
                .collect(Collectors.groupingBy(
                        bt -> bt.getRecruit().getId(),
                        Collectors.mapping(BusinessType::getType, Collectors.toList())
                ));

        // 4) 화면용 DTO 변환
        return recruits.stream()
                .map(recruit -> toResponseDto(
                        recruit,
                        workPeriodMap,
                        workDaysMap,
                        workTimeMap,
                        businessTypeMap
                ))
                .toList();
    }



    private RecruitRecommendResponseDto toResponseDto(
            Recruit recruit,
            Map<Long, List<Period>> workPeriodMap,
            Map<Long, List<Days>> workDaysMap,
            Map<Long, List<Times>> workTimeMap,
            Map<Long, List<BusinessTypeName>> businessTypeMap
    ) {
        Long recruitId = recruit.getId();

        return RecruitRecommendResponseDto.builder()
                .recruitId(recruitId)
                .businessMemberId(recruit.getBusinessMemberId())
                .title(recruit.getTitle())
                .urgent(recruit.isUrgent())
                .status(recruit.getStatus())
                .deadline(recruit.getDeadline())
                .salary(recruit.getSalary())
                .salaryType(recruit.getSalaryType())
                .headCount(recruit.getHeadCount())
                .regionId(recruit.getRegion().getId())
                .sido(recruit.getRegion().getSido())
                .sigungu(recruit.getRegion().getSigungu())
                .detailAddress(recruit.getDetailAddress())
                .description(recruit.getDescription())
                .resumeFormUrl(recruit.getResumeFormUrl())
                .workPeriod(workPeriodMap.getOrDefault(recruitId, List.of()))
                .workDays(workDaysMap.getOrDefault(recruitId, List.of()))
                .workTime(workTimeMap.getOrDefault(recruitId, List.of()))
                .businessType(businessTypeMap.getOrDefault(recruitId, List.of()))
                .build();
    }





}