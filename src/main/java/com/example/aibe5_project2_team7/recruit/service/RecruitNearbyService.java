package com.example.aibe5_project2_team7.recruit.service;

import com.example.aibe5_project2_team7.recruit.constant.*;
import com.example.aibe5_project2_team7.recruit.dto.RecruitNearbyRequestDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitNearbyResponseDto;
import com.example.aibe5_project2_team7.recruit.entity.*;
import com.example.aibe5_project2_team7.recruit.repository.*;
import com.example.aibe5_project2_team7.recruit.util.DistanceUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecruitNearbyService {

    private final RecruitRecommendRepository recruitRecommendRepository;
    private final WorkPeriodRepository workPeriodRepository;
    private final WorkDaysRepository workDaysRepository;
    private final WorkTimeRepository workTimeRepository;
    private final BusinessTypeRepository businessTypeRepository;

    public List<RecruitNearbyResponseDto> findNearbyRecruits(RecruitNearbyRequestDto request) {
        validateRequest(request);

        List<Recruit> recruits = recruitRecommendRepository.findNearbyRecruits(
                request.getLatitude(),
                request.getLongitude(),
                request.getRadiusKm()
        );

        if (recruits.isEmpty()) {
            return List.of();
        }

        List<Long> recruitIds = recruits.stream()
                .map(Recruit::getId)
                .toList();

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

        return recruits.stream()
                .map(recruit -> toResponseDto(
                        recruit,
                        request.getLatitude(),
                        request.getLongitude(),
                        workPeriodMap,
                        workDaysMap,
                        workTimeMap,
                        businessTypeMap
                ))
                .toList();
    }

    private void validateRequest(RecruitNearbyRequestDto request) {
        if (request.getLatitude() == null || request.getLongitude() == null) {
            throw new IllegalArgumentException("현재 위치 위도/경도는 필수입니다.");
        }

        if (request.getRadiusKm() == null || request.getRadiusKm() <= 0) {
            throw new IllegalArgumentException("반경(radiusKm)은 0보다 커야 합니다.");
        }
    }

    private RecruitNearbyResponseDto toResponseDto(
            Recruit recruit,
            Double userLat,
            Double userLng,
            Map<Long, List<Period>> workPeriodMap,
            Map<Long, List<Days>> workDaysMap,
            Map<Long, List<Times>> workTimeMap,
            Map<Long, List<BusinessTypeName>> businessTypeMap
    ) {
        Long recruitId = recruit.getId();

        if (recruit.getLatitude() == null || recruit.getLongitude() == null) {
            throw new IllegalStateException("거리 추천 대상 공고의 위도/경도가 없습니다. recruitId=" + recruitId);
        }

        double distanceKm = DistanceUtils.haversine(
                userLat,
                userLng,
                recruit.getLatitude(),
                recruit.getLongitude()
        );

        return RecruitNearbyResponseDto.builder()
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
                .latitude(recruit.getLatitude())
                .longitude(recruit.getLongitude())
                .distanceKm(DistanceUtils.round3(distanceKm))
                .workPeriod(workPeriodMap.getOrDefault(recruitId, List.of()))
                .workDays(workDaysMap.getOrDefault(recruitId, List.of()))
                .workTime(workTimeMap.getOrDefault(recruitId, List.of()))
                .businessType(businessTypeMap.getOrDefault(recruitId, List.of()))
                .build();
    }
}