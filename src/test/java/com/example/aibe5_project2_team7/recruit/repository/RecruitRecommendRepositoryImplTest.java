package com.example.aibe5_project2_team7.recruit.repository;

import com.example.aibe5_project2_team7.recruit.RecruitRepository;
import com.example.aibe5_project2_team7.recruit.constant.*;
import com.example.aibe5_project2_team7.recruit.dto.RecruitRecommendConditionRequestDto;
import com.example.aibe5_project2_team7.recruit.entity.*;
import com.example.aibe5_project2_team7.region.Region;
import com.example.aibe5_project2_team7.region.RegionRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.IntStream;

@SpringBootTest
@Transactional
class RecruitRecommendRepositoryImplTest {


    @Autowired
    private RecruitRecommendRepository recruitRecommendRepository;

    @PersistenceContext
    private EntityManager em;



    @Test
    @DisplayName("20개의 추천테스트")
    public void showRecommend() {
        RecruitRecommendConditionRequestDto dto = new RecruitRecommendConditionRequestDto();
        dto.setBusinessType(List.of(
                BusinessTypeName.CAFE,
                BusinessTypeName.SERVICE,
                BusinessTypeName.DELIVERY_DRIVER
        ));
        dto.setWorkPeriod(List.of(
                Period.MoreThanOneYear,
                Period.OneDay,
                Period.SixMonths
        ));
        dto.setWorkDays(List.of(Days.TUE, Days.FRI, Days.MON));

        List<Recruit> list = recruitRecommendRepository.getRecommendFieldSearch(dto);

        System.out.println("size = " + list.size());
        for (Recruit r : list) {
            System.out.println(r);
        }

    }





}