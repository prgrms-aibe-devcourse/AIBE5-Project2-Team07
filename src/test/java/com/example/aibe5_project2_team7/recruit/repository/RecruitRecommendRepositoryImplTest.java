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
    private RecruitRepository recruitRepository;

    @Autowired
    private RegionRepository regionRepository;

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


    @Test
    @DisplayName("Recruit 50개와 하위 컬렉션 더미데이터 insert")
    @Commit
    void insertRecruitDummyData() {
        List<Region> regions = prepareRegions();
        Random random = new Random(20260420L);

        List<Recruit> recruits = IntStream.rangeClosed(1, 50)
                .mapToObj(i -> createRecruit(i, regions, random))
                .toList();

        recruitRepository.saveAll(recruits);

        em.flush();
        em.clear();

        System.out.println("저장된 Recruit 수 = " + recruits.size());
    }

    private List<Region> prepareRegions() {
        List<Region> regions = regionRepository.findAll();

        if (!regions.isEmpty()) {
            return regions;
        }

        List<Region> newRegions = new ArrayList<>();
        newRegions.add(createRegion("서울", "강남구"));
        newRegions.add(createRegion("서울", "서초구"));
        newRegions.add(createRegion("경기", "수원시"));
        newRegions.add(createRegion("인천", "부평구"));
        newRegions.add(createRegion("부산", "해운대구"));

        return regionRepository.saveAll(newRegions);
    }

    private Region createRegion(String sido, String sigungu) {
        Region region = new Region();
        ReflectionTestUtils.setField(region, "sido", sido);
        ReflectionTestUtils.setField(region, "sigungu", sigungu);
        return region;
    }

    private Recruit createRecruit(int index, List<Region> regions, Random random) {
        Recruit recruit = new Recruit();

        SalaryType salaryType = random.nextBoolean() ? SalaryType.HOURLY : SalaryType.MONTHLY;

        recruit.setBusinessMemberId((long) ((index % 10) + 1));
        recruit.setTitle("테스트 공고 " + index);
        recruit.setUrgent(index % 5 == 0);
        recruit.setStatus(RecruitStatus.OPEN);
        recruit.setDeadline(LocalDate.now().plusDays(random.nextInt(30) + 1));
        recruit.setSalaryType(salaryType);
        recruit.setSalary(createSalaryByType(salaryType, random));
        recruit.setHeadCount(random.nextInt(4) == 0 ? null : random.nextInt(5) + 1);
        recruit.setRegion(regions.get(random.nextInt(regions.size())));
        recruit.setDetailAddress("테스트로 " + index + "번길 " + (random.nextInt(100) + 1));
        recruit.setDescription("추천 알고리즘 테스트용 더미 공고 설명 " + index);
        recruit.setResumeFormUrl(null);

        addWorkPeriods(recruit, pickDistinct(Period.values(), 1, 2, random));
        addWorkDays(recruit, pickDistinct(Days.values(), 1, 4, random));
        addWorkTimes(recruit, pickDistinct(Times.values(), 1, 2, random));
        addBusinessTypes(recruit, pickDistinct(BusinessTypeName.values(), 1, 2, random));

        return recruit;
    }

    private int createSalaryByType(SalaryType salaryType, Random random) {
        if (salaryType == SalaryType.HOURLY) {
            return 10030 + random.nextInt(4000); // 예: 10030 ~ 14029
        }
        return 2_100_000 + random.nextInt(1_500_000); // 예: 210만 ~ 359만
    }

    private void addWorkPeriods(Recruit recruit, List<Period> periods) {
        for (Period period : periods) {
            WorkPeriod workPeriod = new WorkPeriod();
            workPeriod.setRecruit(recruit);
            workPeriod.setPeriod(period);
            recruit.getWorkPeriod().add(workPeriod);
        }
    }

    private void addWorkDays(Recruit recruit, List<Days> daysList) {
        for (Days day : daysList) {
            WorkDays workDays = new WorkDays();
            workDays.setRecruit(recruit);
            workDays.setDay(day);
            recruit.getWorkDays().add(workDays);
        }
    }

    private void addWorkTimes(Recruit recruit, List<Times> timesList) {
        for (Times times : timesList) {
            WorkTime workTime = new WorkTime();
            workTime.setRecruit(recruit);
            workTime.setTimes(times);
            recruit.getWorkTime().add(workTime);
        }
    }

    private void addBusinessTypes(Recruit recruit, List<BusinessTypeName> types) {
        for (BusinessTypeName type : types) {
            BusinessType businessType = new BusinessType();
            businessType.setRecruit(recruit);
            businessType.setType(type);
            recruit.getBusinessType().add(businessType);
        }
    }

    private <T> List<T> pickDistinct(T[] values, int minCount, int maxCount, Random random) {
        List<T> shuffled = new ArrayList<>(Arrays.asList(values));
        Collections.shuffle(shuffled, random);

        int count = minCount + random.nextInt(maxCount - minCount + 1);
        return new ArrayList<>(shuffled.subList(0, count));
    }


}