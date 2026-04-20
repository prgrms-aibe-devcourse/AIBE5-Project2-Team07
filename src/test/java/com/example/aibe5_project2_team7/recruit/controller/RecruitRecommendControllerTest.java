package com.example.aibe5_project2_team7.recruit.controller;

import com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName;
import com.example.aibe5_project2_team7.recruit.constant.Days;
import com.example.aibe5_project2_team7.recruit.constant.Period;
import com.example.aibe5_project2_team7.recruit.dto.RecruitRecommendConditionRequestDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitRecommendResponseDto;
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
}