package com.example.aibe5_project2_team7.recruit;

import com.example.aibe5_project2_team7.naverapi.service.NaverMapService;
import com.example.aibe5_project2_team7.recruit.constant.*;
import com.example.aibe5_project2_team7.recruit.entity.BusinessType;
import com.example.aibe5_project2_team7.recruit.entity.Recruit;
import com.example.aibe5_project2_team7.recruit.entity.WorkDays;
import com.example.aibe5_project2_team7.recruit.entity.WorkPeriod;
import com.example.aibe5_project2_team7.recruit.entity.WorkTime;

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

@SpringBootTest
@Transactional
@Commit
class RecruitDummyInsert100SimpleTest {

    @Autowired
    private RecruitRepository recruitRepository;

    @Autowired
    private RegionRepository regionRepository;

    @PersistenceContext
    private EntityManager em;

    @Autowired
    private NaverMapService naverMapService;

    @Test
    @DisplayName("Recruit 100개 + 연관데이터 각 1개씩 저장")
    void insertRecruitDummy100() {
        List<AddressSeed> seeds = addressSeeds();
        Map<String, Region> regionCache = new HashMap<>();
        List<Recruit> recruits = new ArrayList<>();

        for (int i = 0; i < seeds.size(); i++) {
            AddressSeed seed = seeds.get(i);

            Region region = regionCache.computeIfAbsent(
                    seed.sido() + "|" + seed.sigungu(),
                    key -> saveRegion(seed.sido(), seed.sigungu())
            );



            recruits.add(buildRecruit(i + 1, seed, region));
        }

        recruitRepository.saveAll(recruits);

        em.flush();
        em.clear();

        System.out.println("저장 완료 Recruit 수 = " + recruits.size());
    }

    private Recruit buildRecruit(int index, AddressSeed seed, Region region) {
        Recruit recruit = new Recruit();

        BusinessTypeName businessTypeName = pickBusinessType(index);
        Period period = pickPeriod(index);
        Days day = pickDay(index);
        Times time = pickTime(index);
        SalaryType salaryType = pickSalaryType(index);

        recruit.setBusinessMemberId((long) ((index % 20) + 1));
        recruit.setTitle(buildTitle(index, seed, businessTypeName));
        recruit.setBrand(null);
        recruit.setUrgent(index % 7 == 0);
        recruit.setStatus(RecruitStatus.OPEN);
        recruit.setDeadline(LocalDate.now().plusDays((index % 30) + 3));
        recruit.setSalaryType(salaryType);
        recruit.setSalary(createSalary(index, salaryType));
        recruit.setHeadCount(index % 9 == 0 ? null : (index % 5) + 1);
        recruit.setRegion(region);

        // 상세주소에는 도시명까지 전부 포함
        recruit.setDetailAddress(seed.fullAddress());

        recruit.setDescription("""
                [%s] 업종 테스트 공고 %03d
                근무기간: %s
                근무요일: %s
                근무시간: %s
                근무지: %s
                거리 추천 및 지도 표시 테스트용 더미데이터입니다.
                """.formatted(
                typeLabel(businessTypeName),
                index,
                period.name(),
                day.name(),
                time.name(),
                seed.fullAddress()
        ));
        recruit.setResumeFormUrl(null);

        addBusinessType(recruit, businessTypeName);
        addWorkPeriod(recruit, period);
        addWorkDay(recruit, day);
        addWorkTime(recruit, time);

        double[] coords = naverMapService.getCoordinates(recruit.getDetailAddress());
        recruit.setLatitude(coords[0]);//위도
        recruit.setLongitude(coords[1]);//경도
        return recruit;
    }

    private void addBusinessType(Recruit recruit, BusinessTypeName typeName) {
        BusinessType businessType = new BusinessType();
        businessType.setRecruit(recruit);
        businessType.setType(typeName);
        recruit.getBusinessType().add(businessType);
    }

    private void addWorkPeriod(Recruit recruit, Period period) {
        WorkPeriod workPeriod = new WorkPeriod();
        workPeriod.setRecruit(recruit);
        workPeriod.setPeriod(period);
        recruit.getWorkPeriod().add(workPeriod);
    }

    private void addWorkDay(Recruit recruit, Days day) {
        WorkDays workDays = new WorkDays();
        workDays.setRecruit(recruit);
        workDays.setDay(day);
        recruit.getWorkDays().add(workDays);
    }

    private void addWorkTime(Recruit recruit, Times times) {
        WorkTime workTime = new WorkTime();
        workTime.setRecruit(recruit);
        workTime.setTimes(times);
        recruit.getWorkTime().add(workTime);
    }

    private BusinessTypeName pickBusinessType(int index) {
        BusinessTypeName[] values = BusinessTypeName.values();
        return values[(index - 1) % values.length];
    }

    private Period pickPeriod(int index) {
        Period[] values = Period.values();
        return values[(index - 1) % values.length];
    }

    private Days pickDay(int index) {
        Days[] values = Days.values();
        return values[(index - 1) % values.length];
    }

    private Times pickTime(int index) {
        Times[] values = Times.values();
        return values[(index - 1) % values.length];
    }

    private SalaryType pickSalaryType(int index) {
        SalaryType[] values = SalaryType.values();
        return values[(index - 1) % values.length];
    }

    private int createSalary(int index, SalaryType salaryType) {
        if (salaryType == SalaryType.HOURLY) {
            return 10030 + ((index - 1) % 8) * 400;
        }
        return 2_100_000 + ((index - 1) % 8) * 100_000;
    }

    private String buildTitle(int index, AddressSeed seed, BusinessTypeName type) {
        return "%s %s %s 채용공고 %03d"
                .formatted(seed.sigungu(), typeLabel(type), shortRoadName(seed.roadAddress()), index);
    }

    private String shortRoadName(String roadAddress) {
        String[] parts = roadAddress.split(" ");
        return parts.length > 0 ? parts[0] : roadAddress;
    }

    private String typeLabel(BusinessTypeName type) {
        return switch (type) {
            case FOOD_RESTAURANT -> "음식점";
            case CAFE -> "카페";
            case RETAIL_STORE -> "매장판매";
            case SERVICE -> "서비스";
            case DELIVERY_DRIVER -> "운전배달";
            case MANUAL_LABOR -> "단순노무";
        };
    }

    private Region saveRegion(String sido, String sigungu) {
        Region region = new Region();
        ReflectionTestUtils.setField(region, "sido", sido);
        ReflectionTestUtils.setField(region, "sigungu", sigungu);
        return regionRepository.save(region);
    }

    private List<AddressSeed> addressSeeds() {
        return List.of(
                new AddressSeed("서울특별시", "강남구", "테헤란로 152"),
                new AddressSeed("서울특별시", "강남구", "강남대로 396"),
                new AddressSeed("서울특별시", "강남구", "봉은사로 524"),
                new AddressSeed("서울특별시", "강남구", "도산대로 318"),
                new AddressSeed("서울특별시", "강남구", "삼성로 212"),

                new AddressSeed("서울특별시", "서초구", "서초대로 396"),
                new AddressSeed("서울특별시", "서초구", "반포대로 58"),
                new AddressSeed("서울특별시", "서초구", "강남대로 465"),
                new AddressSeed("서울특별시", "서초구", "효령로 176"),
                new AddressSeed("서울특별시", "서초구", "동작대로 350"),

                new AddressSeed("서울특별시", "송파구", "올림픽로 300"),
                new AddressSeed("서울특별시", "송파구", "송파대로 570"),
                new AddressSeed("서울특별시", "송파구", "백제고분로 69"),
                new AddressSeed("서울특별시", "송파구", "오금로 111"),
                new AddressSeed("서울특별시", "송파구", "위례성대로 2"),

                new AddressSeed("서울특별시", "마포구", "양화로 188"),
                new AddressSeed("서울특별시", "마포구", "월드컵북로 400"),
                new AddressSeed("서울특별시", "마포구", "독막로 311"),
                new AddressSeed("서울특별시", "마포구", "마포대로 92"),
                new AddressSeed("서울특별시", "마포구", "서강로 136"),

                new AddressSeed("서울특별시", "영등포구", "국제금융로 10"),
                new AddressSeed("서울특별시", "영등포구", "영중로 15"),
                new AddressSeed("서울특별시", "영등포구", "선유로 130"),
                new AddressSeed("서울특별시", "영등포구", "경인로 846"),
                new AddressSeed("서울특별시", "영등포구", "여의대로 108"),

                new AddressSeed("서울특별시", "중구", "세종대로 110"),
                new AddressSeed("서울특별시", "중구", "을지로 281"),
                new AddressSeed("서울특별시", "중구", "퇴계로 100"),
                new AddressSeed("서울특별시", "중구", "명동길 74"),
                new AddressSeed("서울특별시", "중구", "청계천로 40"),

                new AddressSeed("부산광역시", "해운대구", "센텀남대로 35"),
                new AddressSeed("부산광역시", "해운대구", "해운대로 620"),
                new AddressSeed("부산광역시", "해운대구", "APEC로 55"),
                new AddressSeed("부산광역시", "해운대구", "해운대해변로 203"),
                new AddressSeed("부산광역시", "해운대구", "좌동순환로 511"),

                new AddressSeed("부산광역시", "부산진구", "중앙대로 672"),
                new AddressSeed("부산광역시", "부산진구", "가야대로 772"),
                new AddressSeed("부산광역시", "부산진구", "서면로 39"),
                new AddressSeed("부산광역시", "부산진구", "동천로 109"),
                new AddressSeed("부산광역시", "부산진구", "부전로 79"),

                new AddressSeed("대구광역시", "수성구", "동대구로 95"),
                new AddressSeed("대구광역시", "수성구", "달구벌대로 2435"),
                new AddressSeed("대구광역시", "수성구", "청수로 133"),
                new AddressSeed("대구광역시", "수성구", "수성로 393"),
                new AddressSeed("대구광역시", "수성구", "무학로 114"),

                new AddressSeed("인천광역시", "연수구", "컨벤시아대로 165"),
                new AddressSeed("인천광역시", "연수구", "센트럴로 123"),
                new AddressSeed("인천광역시", "연수구", "아트센터대로 175"),
                new AddressSeed("인천광역시", "연수구", "송도과학로 32"),
                new AddressSeed("인천광역시", "연수구", "해돋이로 160"),

                new AddressSeed("광주광역시", "서구", "상무중앙로 110"),
                new AddressSeed("광주광역시", "서구", "상무대로 773"),
                new AddressSeed("광주광역시", "서구", "죽봉대로 80"),
                new AddressSeed("광주광역시", "서구", "금화로 240"),
                new AddressSeed("광주광역시", "서구", "무진대로 932"),

                new AddressSeed("대전광역시", "유성구", "대덕대로 480"),
                new AddressSeed("대전광역시", "유성구", "대학로 291"),
                new AddressSeed("대전광역시", "유성구", "엑스포로 107"),
                new AddressSeed("대전광역시", "유성구", "계룡로 105"),
                new AddressSeed("대전광역시", "유성구", "테크노중앙로 123"),

                new AddressSeed("울산광역시", "남구", "삼산로 261"),
                new AddressSeed("울산광역시", "남구", "문수로 44"),
                new AddressSeed("울산광역시", "남구", "번영로 200"),
                new AddressSeed("울산광역시", "남구", "대공원로 94"),
                new AddressSeed("울산광역시", "남구", "수암로 138"),

                new AddressSeed("경기도", "수원시 영통구", "광교중앙로 140"),
                new AddressSeed("경기도", "수원시 영통구", "덕영대로 1566"),
                new AddressSeed("경기도", "수원시 영통구", "중부대로 295"),
                new AddressSeed("경기도", "수원시 영통구", "봉영로 1612"),
                new AddressSeed("경기도", "수원시 영통구", "센트럴타운로 85"),

                new AddressSeed("경기도", "성남시 분당구", "판교역로 235"),
                new AddressSeed("경기도", "성남시 분당구", "분당내곡로 131"),
                new AddressSeed("경기도", "성남시 분당구", "성남대로 925"),
                new AddressSeed("경기도", "성남시 분당구", "정자일로 95"),
                new AddressSeed("경기도", "성남시 분당구", "황새울로360번길 42"),

                new AddressSeed("경기도", "고양시 일산동구", "중앙로 1036"),
                new AddressSeed("경기도", "고양시 일산동구", "정발산로 24"),
                new AddressSeed("경기도", "고양시 일산동구", "호수로 595"),
                new AddressSeed("경기도", "고양시 일산동구", "백마로 195"),
                new AddressSeed("경기도", "고양시 일산동구", "고봉로 32-19"),

                new AddressSeed("경기도", "화성시", "동탄대로 537"),
                new AddressSeed("경기도", "화성시", "동탄중앙로 220"),
                new AddressSeed("경기도", "화성시", "노작로 147"),
                new AddressSeed("경기도", "화성시", "효행로 1052"),
                new AddressSeed("경기도", "화성시", "봉담읍 동화길 51"),

                new AddressSeed("전북특별자치도", "전주시 완산구", "홍산로 276"),
                new AddressSeed("전북특별자치도", "전주시 완산구", "백제대로 222"),
                new AddressSeed("전북특별자치도", "전주시 완산구", "온고을로 2"),
                new AddressSeed("전북특별자치도", "전주시 완산구", "서원로 77"),
                new AddressSeed("전북특별자치도", "전주시 완산구", "기린대로 213"),

                new AddressSeed("경상남도", "창원시 성산구", "원이대로 450"),
                new AddressSeed("경상남도", "창원시 성산구", "상남로 122"),
                new AddressSeed("경상남도", "창원시 성산구", "중앙대로 151"),
                new AddressSeed("경상남도", "창원시 성산구", "마디미로 28"),
                new AddressSeed("경상남도", "창원시 성산구", "대암로 252"),

                new AddressSeed("제주특별자치도", "제주시", "연삼로 315"),
                new AddressSeed("제주특별자치도", "제주시", "중앙로 151"),
                new AddressSeed("제주특별자치도", "제주시", "서광로 301"),
                new AddressSeed("제주특별자치도", "제주시", "노형로 407"),
                new AddressSeed("제주특별자치도", "제주시", "1100로 3348")
        );
    }

    private record AddressSeed(String sido, String sigungu, String roadAddress) {
        String fullAddress() {
            return sido + " " + sigungu + " " + roadAddress;
        }
    }
}