package com.example.aibe5_project2_team7.recruit.repository;
import com.example.aibe5_project2_team7.recruit.Recruit;
import com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName;
import com.example.aibe5_project2_team7.recruit.constant.Days;
import com.example.aibe5_project2_team7.recruit.constant.Period;
import com.example.aibe5_project2_team7.recruit.constant.RecruitStatus;
import com.example.aibe5_project2_team7.recruit.constant.SalaryType;
import com.example.aibe5_project2_team7.recruit.constant.Times;
import com.example.aibe5_project2_team7.recruit.dto.RecruitDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class RecruitRecommendRepositoryTest {

    @Autowired
    private RecruitRepository recuitRepository;

    @PersistenceContext
    private EntityManager em;

    @Test
    @DisplayName("Recruit 100개 저장 테스트")
    void insert100Recruits() {
        // given
        save100RecruitData();

        em.flush();
        em.clear();

        // when
        List<Recruit> all = recuitRepository.findAll();

        // then
        assertThat(all).hasSize(100);
    }

    @Test
    @DisplayName("추천 조건과 가장 많이 일치하는 공고")
    void recommendRecruits() {
        // given
        save100RecruitData();

        RecruitDto condition = RecruitDto.builder()
                .businessTypeName(BusinessTypeName.CAFE)
                .days(Days.SAT)
                .times(Times.EVENING)
                .salaryType(SalaryType.HOURLY)
                .period(Period.OneMonth)
                .isUrgent(true)
                .build();

        em.flush();
        em.clear();

        // when
        List<Recruit> result = recuitRepository.getRecommendFieldSearch(condition);
                // then
        assertThat(result).isNotEmpty();
        assertThat(result.size()).isLessThanOrEqualTo(20);

        // 추천 결과는 모두 OPEN 이어야 함
        assertThat(result)
                .extracting(Recruit::getRecruitStatus)
                .containsOnly(RecruitStatus.OPEN);

        // 상위 추천 결과는 요청 조건과 잘 맞아야 함
        Recruit top = result.get(0);
        assertThat(top.getBusinessTypeName()).isEqualTo(BusinessTypeName.CAFE);
        assertThat(top.getDays()).isEqualTo(Days.SAT);
        assertThat(top.getTimes()).isEqualTo(Times.EVENING);

        // 완전 일치 공고 10개를 뒤에 따로 넣어두므로 상위 10개는 모두 완전 일치해야 함
        assertThat(result.stream().limit(10))
                .allSatisfy(recruit -> {
                    assertThat(recruit.getRecruitStatus()).isEqualTo(RecruitStatus.OPEN);
                    assertThat(recruit.getBusinessTypeName()).isEqualTo(BusinessTypeName.CAFE);
                    assertThat(recruit.getDays()).isEqualTo(Days.SAT);
                    assertThat(recruit.getTimes()).isEqualTo(Times.EVENING);
                    assertThat(recruit.getSalaryType()).isEqualTo(SalaryType.HOURLY);
                    assertThat(recruit.getPeriod()).isEqualTo(Period.OneMonth);
                    assertThat(recruit.getIsUrgent()).isTrue();
                });
        System.out.println("추천 결과 : ");
        for(Recruit r: result){
            System.out.println(r);
        }

    }

    private void save100RecruitData() {
        recuitRepository.deleteAllInBatch();

        // 1~85번: 다양한 패턴의 일반 데이터
        IntStream.rangeClosed(1, 85)
                .mapToObj(this::createMixedRecruit)
                .forEach(recuitRepository::save);

        // 86~95번: 추천 조건에 완전 일치하는 OPEN 공고 10개
        IntStream.rangeClosed(86, 95)
                .mapToObj(i -> createPerfectMatchOpenRecruit())
                .forEach(recuitRepository::save);

        // 96~100번: 조건은 완전 일치하지만 CLOSED 처리된 공고 5개
        IntStream.rangeClosed(96, 100)
                .mapToObj(i -> createPerfectMatchClosedRecruit())
                .forEach(recuitRepository::save);
    }

    private Recruit createMixedRecruit(int index) {
        BusinessTypeName[] businessTypes = BusinessTypeName.values();
        Days[] daysValues = Days.values();
        Period[] periods = Period.values();
        SalaryType[] salaryTypes = SalaryType.values();
        Times[] timesValues = Times.values();

        return Recruit.builder()
                .isUrgent(index % 2 == 0)
                .businessTypeName(businessTypes[index % businessTypes.length])
                .days(daysValues[index % daysValues.length])
                .period(periods[index % periods.length])
                .recruitStatus(index % 7 == 0 ? RecruitStatus.CLOSED : RecruitStatus.OPEN)
                .salaryType(salaryTypes[index % salaryTypes.length])
                .times(timesValues[index % timesValues.length])
                .build();
    }

    private Recruit createPerfectMatchOpenRecruit() {
        return Recruit.builder()
                .isUrgent(true)
                .businessTypeName(BusinessTypeName.CAFE)
                .days(Days.SAT)
                .period(Period.OneMonth)
                .recruitStatus(RecruitStatus.OPEN)
                .salaryType(SalaryType.HOURLY)
                .times(Times.EVENING)
                .build();
    }

    private Recruit createPerfectMatchClosedRecruit() {
        return Recruit.builder()
                .isUrgent(true)
                .businessTypeName(BusinessTypeName.CAFE)
                .days(Days.SAT)
                .period(Period.OneMonth)
                .recruitStatus(RecruitStatus.CLOSED)
                .salaryType(SalaryType.HOURLY)
                .times(Times.EVENING)
                .build();
    }
}