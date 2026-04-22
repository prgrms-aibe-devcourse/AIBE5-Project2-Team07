package com.example.aibe5_project2_team7.recruit;

import com.example.aibe5_project2_team7.recruit.constant.*;
import com.example.aibe5_project2_team7.recruit.entity.*;
import com.example.aibe5_project2_team7.region.Region;
import com.example.aibe5_project2_team7.region.RegionRepository;
import jakarta.persistence.EntityManager;
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
class RecruitDummyDataTest {

    @Autowired
    private RecruitRepository recruitRepository;

    @Autowired
    private RegionRepository regionRepository;
    @Autowired
    private EntityManager em;

    @Test
    @Commit
    @DisplayName("절대 중복되지 않는 서울 주소 100개를 포함한 공고 더미데이터 생성")
    void insertUniqueDummyRecruits() {
        Random random = new Random();

        // 1. 단 하나도 겹치지 않는 서울 실제 주소 100개 (10개 구 단위로 분산)
        String[] seoulAddresses = {
                // 강남구 테헤란로 (10개)
                "서울특별시 강남구 테헤란로 111", "서울특별시 강남구 테헤란로 113", "서울특별시 강남구 테헤란로 115", "서울특별시 강남구 테헤란로 121", "서울특별시 강남구 테헤란로 123",
                "서울특별시 강남구 테헤란로 131", "서울특별시 강남구 테헤란로 133", "서울특별시 강남구 테헤란로 141", "서울특별시 강남구 테헤란로 145", "서울특별시 강남구 테헤란로 152",
                // 서초구 강남대로 (10개)
                "서울특별시 서초구 강남대로 311", "서울특별시 서초구 강남대로 321", "서울특별시 서초구 강남대로 331", "서울특별시 서초구 강남대로 341", "서울특별시 서초구 강남대로 351",
                "서울특별시 서초구 강남대로 361", "서울특별시 서초구 강남대로 371", "서울특별시 서초구 강남대로 381", "서울특별시 서초구 강남대로 391", "서울특별시 서초구 강남대로 405",
                // 송파구 올림픽로 (10개)
                "서울특별시 송파구 올림픽로 101", "서울특별시 송파구 올림픽로 111", "서울특별시 송파구 올림픽로 121", "서울특별시 송파구 올림픽로 131", "서울특별시 송파구 올림픽로 141",
                "서울특별시 송파구 올림픽로 151", "서울특별시 송파구 올림픽로 161", "서울특별시 송파구 올림픽로 171", "서울특별시 송파구 올림픽로 181", "서울특별시 송파구 올림픽로 300",
                // 영등포구 여의대로 (10개)
                "서울특별시 영등포구 여의대로 10", "서울특별시 영등포구 여의대로 12", "서울특별시 영등포구 여의대로 14", "서울특별시 영등포구 여의대로 16", "서울특별시 영등포구 여의대로 18",
                "서울특별시 영등포구 여의대로 20", "서울특별시 영등포구 여의대로 22", "서울특별시 영등포구 여의대로 24", "서울특별시 영등포구 여의대로 66", "서울특별시 영등포구 여의대로 108",
                // 마포구 양화로 (10개)
                "서울특별시 마포구 양화로 45", "서울특별시 마포구 양화로 55", "서울특별시 마포구 양화로 65", "서울특별시 마포구 양화로 75", "서울특별시 마포구 양화로 85",
                "서울특별시 마포구 양화로 95", "서울특별시 마포구 양화로 105", "서울특별시 마포구 양화로 115", "서울특별시 마포구 양화로 125", "서울특별시 마포구 양화로 160",
                // 용산구 한강대로 (10개)
                "서울특별시 용산구 한강대로 15", "서울특별시 용산구 한강대로 25", "서울특별시 용산구 한강대로 35", "서울특별시 용산구 한강대로 45", "서울특별시 용산구 한강대로 55",
                "서울특별시 용산구 한강대로 65", "서울특별시 용산구 한강대로 75", "서울특별시 용산구 한강대로 85", "서울특별시 용산구 한강대로 95", "서울특별시 용산구 한강대로 105",
                // 종로구 종로 (10개)
                "서울특별시 종로구 종로 1", "서울특별시 종로구 종로 5", "서울특별시 종로구 종로 10", "서울특별시 종로구 종로 15", "서울특별시 종로구 종로 20",
                "서울특별시 종로구 종로 25", "서울특별시 종로구 종로 30", "서울특별시 종로구 종로 35", "서울특별시 종로구 종로 40", "서울특별시 종로구 종로 50",
                // 중구 세종대로 (10개)
                "서울특별시 중구 세종대로 10", "서울특별시 중구 세종대로 20", "서울특별시 중구 세종대로 30", "서울특별시 중구 세종대로 40", "서울특별시 중구 세종대로 50",
                "서울특별시 중구 세종대로 60", "서울특별시 중구 세종대로 70", "서울특별시 중구 세종대로 80", "서울특별시 중구 세종대로 90", "서울특별시 중구 세종대로 110",
                // 구로구 디지털로 (10개)
                "서울특별시 구로구 디지털로 271", "서울특별시 구로구 디지털로 273", "서울특별시 구로구 디지털로 275", "서울특별시 구로구 디지털로 277", "서울특별시 구로구 디지털로 281",
                "서울특별시 구로구 디지털로 283", "서울특별시 구로구 디지털로 285", "서울특별시 구로구 디지털로 287", "서울특별시 구로구 디지털로 289", "서울특별시 구로구 디지털로 300",
                // 관악구 남부순환로 (10개)
                "서울특별시 관악구 남부순환로 1800", "서울특별시 관악구 남부순환로 1810", "서울특별시 관악구 남부순환로 1820", "서울특별시 관악구 남부순환로 1830", "서울특별시 관악구 남부순환로 1840",
                "서울특별시 관악구 남부순환로 1850", "서울특별시 관악구 남부순환로 1860", "서울특별시 관악구 남부순환로 1870", "서울특별시 관악구 남부순환로 1880", "서울특별시 관악구 남부순환로 1890"
        };

        String[] titles = {
                "스타벅스 오전 파트타이머 급구", "CU 편의점 주말 야간 알바", "쿠팡 물류센터 당일알바",
                "배달의민족 라이더 모집", "아웃백 홀 서빙 직원 구함", "피시방 평일 오후 카운터"
        };

        // Region 세팅 (DB 구조에 맞게 수정)
        Region dummyRegion = new Region();
        // dummyRegion.setName("서울");
        em.persist(dummyRegion);

        System.out.println("🚀 고유 주소 더미 데이터 100개 삽입 시작...");

        // 100번 반복 (배열 인덱스 0 ~ 99)
        for (int i = 0; i < 100; i++) {
            Recruit recruit = new Recruit();
            recruit.setBusinessMemberId((long)(random.nextInt(10) + 1)); // 사업자 ID도 1~10으로 다양하게
            recruit.setTitle(titles[random.nextInt(titles.length)] + " [" + (i+1) + "]");
            recruit.setUrgent(random.nextBoolean());
            recruit.setStatus(RecruitStatus.OPEN);
            recruit.setDeadline(LocalDate.now().plusDays(random.nextInt(30) + 1));
            recruit.setSalaryType(SalaryType.HOURLY);
            recruit.setSalary(9860 + (random.nextInt(6) * 1000));
            recruit.setRegion(dummyRegion);

            // ⭐ 핵심: 100개의 주소를 겹치지 않고 순서대로 1개씩 꽂아 넣음!
            recruit.setDetailAddress(seoulAddresses[i]);

            recruit.setDescription("성실하게 일하실 분 찾습니다. 초보자 환영!");

            // -- 연관 엔티티 세팅 --
            WorkDays workDay = new WorkDays();
            workDay.setDay(Days.values()[random.nextInt(Days.values().length)]);
            workDay.setRecruit(recruit);
            recruit.getWorkDays().add(workDay);

            WorkPeriod workPeriod = new WorkPeriod();
            workPeriod.setPeriod(Period.values()[random.nextInt(Period.values().length)]);
            workPeriod.setRecruit(recruit);
            recruit.getWorkPeriod().add(workPeriod);

            WorkTime workTime = new WorkTime();
            workTime.setTimes(Times.values()[random.nextInt(Times.values().length)]);
            workTime.setRecruit(recruit);
            recruit.getWorkTime().add(workTime);

            BusinessType businessType = new BusinessType();
            businessType.setType(BusinessTypeName.values()[random.nextInt(BusinessTypeName.values().length)]);
            businessType.setRecruit(recruit);
            recruit.getBusinessType().add(businessType);

            // DB 저장
            em.persist(recruit);
        }

        System.out.println("✅ 단 하나도 겹치지 않는 더미 데이터 100개 삽입 완료!");
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