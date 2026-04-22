package com.example.aibe5_project2_team7.recruit.controller;

import com.example.aibe5_project2_team7.naverapi.service.NaverMapService;
import com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName;
import com.example.aibe5_project2_team7.recruit.constant.Days;
import com.example.aibe5_project2_team7.recruit.constant.Period;
import com.example.aibe5_project2_team7.recruit.dto.RecruitNearbyRequestDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitRecommendConditionRequestDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitRecommendResponseDto;
import com.mysema.commons.lang.Assert;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class RecruitRecommendControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private NaverMapService naverMapService;
    @Test
    @DisplayName("카테고리 추천 api테스트")
    void recommendApiTest() throws Exception{
        RecruitRecommendConditionRequestDto request = new RecruitRecommendConditionRequestDto();
        request.setBusinessType(List.of(
                BusinessTypeName.CAFE,
                BusinessTypeName.SERVICE,
                BusinessTypeName.DELIVERY_DRIVER
        ));
        request.setWorkPeriod(List.of(
                Period.MoreThanOneYear,
                Period.OneDay,
                Period.SixMonths
        ));
        request.setWorkDays(List.of(
                Days.TUE,
                Days.FRI,
                Days.MON
        ));

        MvcResult result =  mockMvc.perform(post("/recommend/category")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();
        String responseBody = result.getResponse().getContentAsString();

        List<RecruitRecommendResponseDto> list =
                objectMapper.readValue(
                        responseBody,
                        new TypeReference<List<RecruitRecommendResponseDto>>() {}
                );

        System.out.println("size = " + list.size());
        for (RecruitRecommendResponseDto dto : list) {
            System.out.println(dto);
        }

    }

    @Test
    @DisplayName("거리 기반 추천 API 호출 성공 + 응답 출력")
    void findNearbyRecruits_success() throws Exception {
        double[] coord= naverMapService.getCoordinates("신촌역로 1");

        RecruitNearbyRequestDto request = RecruitNearbyRequestDto.builder()
                .latitude(coord[0])
                .longitude(coord[1])
                .radiusKm(3.0)
                .build();

        MvcResult result = mockMvc.perform(post("/recommend/nearby")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();

        System.out.println("========== 요청값 ==========");
        System.out.println("latitude  = " + request.getLatitude());
        System.out.println("longitude = " + request.getLongitude());
        System.out.println("radiusKm  = " + request.getRadiusKm());

        System.out.println("========== 응답 JSON ==========");
        System.out.println(responseBody);

        List<RecruitRecommendResponseDto> list = objectMapper.readValue(
                responseBody,
                new TypeReference<List<RecruitRecommendResponseDto>>() {}
        );

        System.out.println("========== 파싱된 응답 DTO ==========");
        System.out.println("result size = " + list.size());

        for (int i = 0; i < list.size(); i++) {
            RecruitRecommendResponseDto dto = list.get(i);

            System.out.println("----- [" + (i + 1) + "] -----");
            System.out.println("recruitId       = " + dto.getRecruitId());
            System.out.println("businessMemberId= " + dto.getBusinessMemberId());
            System.out.println("title           = " + dto.getTitle());
            System.out.println("urgent          = " + dto.isUrgent());
            System.out.println("status          = " + dto.getStatus());
            System.out.println("deadline        = " + dto.getDeadline());
            System.out.println("salary          = " + dto.getSalary());
            System.out.println("salaryType      = " + dto.getSalaryType());
            System.out.println("headCount       = " + dto.getHeadCount());
            System.out.println("regionId        = " + dto.getRegionId());
            System.out.println("sido            = " + dto.getSido());
            System.out.println("sigungu         = " + dto.getSigungu());
            System.out.println("detailAddress   = " + dto.getDetailAddress());
            System.out.println("description     = " + dto.getDescription());
            System.out.println("resumeFormUrl   = " + dto.getResumeFormUrl());
            System.out.println("workPeriod      = " + dto.getWorkPeriod());
            System.out.println("workDays        = " + dto.getWorkDays());
            System.out.println("workTime        = " + dto.getWorkTime());
            System.out.println("businessType    = " + dto.getBusinessType());
        }

        assertThat(list).isNotNull();
        assertThat(list.size()).isLessThanOrEqualTo(20);

        for (RecruitRecommendResponseDto dto : list) {
            assertThat(dto.getRecruitId()).isNotNull();
            assertThat(dto.getBusinessMemberId()).isNotNull();
            assertThat(dto.getTitle()).isNotBlank();
            assertThat(dto.getStatus()).isNotNull();
            assertThat(dto.getRegionId()).isNotNull();
            assertThat(dto.getSido()).isNotBlank();
            assertThat(dto.getSigungu()).isNotBlank();
            assertThat(dto.getDetailAddress()).isNotBlank();
        }
    }




}