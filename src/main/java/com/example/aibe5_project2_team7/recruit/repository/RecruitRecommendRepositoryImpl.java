package com.example.aibe5_project2_team7.recruit.repository;

import com.example.aibe5_project2_team7.recruit.constant.*;
import com.example.aibe5_project2_team7.recruit.dto.RecruitRecommendConditionRequestDto;
import com.example.aibe5_project2_team7.recruit.entity.*;
import com.querydsl.core.types.dsl.*;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.example.aibe5_project2_team7.recruit.entity.QRecruit.recruit;

@RequiredArgsConstructor
@Repository
public class RecruitRecommendRepositoryImpl implements RecruitRecommendRepository {

    private final JPAQueryFactory queryFactory;

    // 서브쿼리용 별칭
    private final QWorkPeriod wp = new QWorkPeriod("wp");
    private final QWorkDays wd = new QWorkDays("wd");
    private final QWorkTime wt = new QWorkTime("wt");
    private final QBusinessType bt = new QBusinessType("bt");

    @Override
    public List<Recruit> getRecommendFieldSearch(RecruitRecommendConditionRequestDto condition) {

        NumberExpression<Integer> score =
                zero()
                        .add(workPeriodScore(condition.getWorkPeriod()))
                        .add(workDaysScore(condition.getWorkDays()))
                        .add(workTimeScore(condition.getWorkTime()))
                        .add(businessTypeScore(condition.getBusinessType()))
                        .add(salaryTypeScore(condition.getSalaryType()))
                        .add(urgentScore(condition.getUrgent()));

        // 1차: 추천 점수로 recruit.id 20개만 추출
        List<Long> recruitIds = queryFactory
                .select(recruit.id)
                .from(recruit)
                .where(
                        recruit.status.eq(RecruitStatus.OPEN),
                        regionEq(condition.getRegionId()),
                        hasAnyScoringCondition(condition) ? score.gt(0) : null
                )
                .orderBy(
                        score.desc(),
                        recruit.isUrgent.desc(),
                        recruit.deadline.asc(),
                        recruit.id.desc()
                )
                .limit(condition.getResultCount())
                .fetch();

        if (recruitIds.isEmpty()) {
            return List.of();
        }

        // 2차: IN 으로 상세 조회
        List<Recruit> recruits = queryFactory
                .selectFrom(recruit)
                .leftJoin(recruit.region).fetchJoin()
                .leftJoin(recruit.brand).fetchJoin()
                .where(recruit.id.in(recruitIds))
                .fetch();

        // IN 조회는 순서 보장이 없으므로 1차 id 순서대로 재정렬
        Map<Long, Integer> orderMap = new HashMap<>();
        for (int i = 0; i < recruitIds.size(); i++) {
            orderMap.put(recruitIds.get(i), i);
        }

        recruits.sort(Comparator.comparingInt(r -> orderMap.get(r.getId())));

        return recruits;
    }

    private BooleanExpression regionEq(Long regionId) {
        // 지역을 선택하지 않으면 전체 지역 조회
        return regionId == null ? null : recruit.region.id.eq(regionId.intValue());
    }

    private boolean hasAnyScoringCondition(RecruitRecommendConditionRequestDto condition) {
        return hasList(condition.getWorkPeriod())
                || hasList(condition.getWorkDays())
                || hasList(condition.getWorkTime())
                || hasList(condition.getBusinessType())
                || condition.getSalaryType() != null
                || condition.getUrgent() != null;
    }

    private boolean hasList(List<?> list) {
        return list != null && !list.isEmpty();
    }

    private NumberExpression<Integer> zero() {
        return Expressions.numberTemplate(Integer.class, "0");
    }

    // 근무기간 일치 개수 * 2점
    private NumberExpression<Integer> workPeriodScore(List<Period> periods) {
        if (!hasList(periods)) {
            return zero();
        }

        return Expressions.numberTemplate(
                Integer.class,
                "coalesce(({0}), 0)",
                JPAExpressions
                        .select(wp.id.count().intValue().multiply(2))
                        .from(wp)
                        .where(
                                wp.recruit.eq(recruit),
                                wp.period.in(periods)
                        )
        );
    }

    // 근무요일 일치 개수 * 3점
    private NumberExpression<Integer> workDaysScore(List<Days> days) {
        if (!hasList(days)) {
            return zero();
        }

        return Expressions.numberTemplate(
                Integer.class,
                "coalesce(({0}), 0)",
                JPAExpressions
                        .select(wd.id.count().intValue().multiply(3))
                        .from(wd)
                        .where(
                                wd.recruit.eq(recruit),
                                wd.day.in(days)
                        )
        );
    }

    // 근무시간 일치 개수 * 3점
    private NumberExpression<Integer> workTimeScore(List<Times> times) {
        if (!hasList(times)) {
            return zero();
        }

        return Expressions.numberTemplate(
                Integer.class,
                "coalesce(({0}), 0)",
                JPAExpressions
                        .select(wt.id.count().intValue().multiply(3))
                        .from(wt)
                        .where(
                                wt.recruit.eq(recruit),
                                wt.times.in(times)
                        )
        );
    }

    // 업종 일치 개수 * 4점
    private NumberExpression<Integer> businessTypeScore(List<BusinessTypeName> types) {
        if (!hasList(types)) {
            return zero();
        }

        return Expressions.numberTemplate(
                Integer.class,
                "coalesce(({0}), 0)",
                JPAExpressions
                        .select(bt.id.count().intValue().multiply(4))
                        .from(bt)
                        .where(
                                bt.recruit.eq(recruit),
                                bt.type.in(types)
                        )
        );
    }

    // 급여타입 일치 시 2점
    private NumberExpression<Integer> salaryTypeScore(SalaryType salaryType) {
        if (salaryType == null) {
            return zero();
        }

        return new CaseBuilder()
                .when(recruit.salaryType.eq(salaryType)).then(2)
                .otherwise(0);
    }

    // 긴급여부 일치 시 1점
    private NumberExpression<Integer> urgentScore(Boolean urgent) {
        if (urgent == null) {
            return zero();
        }

        return new CaseBuilder()
                .when(recruit.isUrgent.eq(urgent)).then(1)
                .otherwise(0);
    }

    @Override
    public List<Recruit> findNearbyRecruits(Double userLat, Double userLng, Double radiusKm) {

        if (userLat == null || userLng == null || radiusKm == null || radiusKm <= 0) {
            return List.of();
        }

        double latRange = radiusKm / 111.0; //위도 1도 대략 111km
        double lngRange = radiusKm / (111.0 * Math.cos(Math.toRadians(userLat)));

        NumberExpression<Double> distanceExpression = Expressions.numberTemplate(
                Double.class,
                """
                6371 * acos(
                    least(1.0, greatest(-1.0,
                        cos(radians({0})) * cos(radians({1})) *
                        cos(radians({2}) - radians({3})) +
                        sin(radians({0})) * sin(radians({1}))
                    ))
                )
                """,
                userLat, recruit.latitude, recruit.longitude, userLng
        );
        //사각형구조
        return queryFactory
                .selectFrom(recruit)
                .where(
                        recruit.status.eq(RecruitStatus.OPEN),
                        recruit.latitude.isNotNull(),
                        recruit.longitude.isNotNull(),
                        //between 내지점에서 해당사각형 내로 필터링 bounding box화
                        recruit.latitude.between(userLat - latRange, userLat + latRange),
                        recruit.longitude.between(userLng - lngRange, userLng + lngRange),
                        // 2. 계산된 거리가 내가 지정한 원의 반경 radiusKm 이하인 것만 필터링
                        distanceExpression.loe(radiusKm)
                )
                .orderBy(distanceExpression.asc(), recruit.id.desc())
                .limit(20)
                .fetch();

        //        //원의범위
        //        // 하버사인 공식 (지구의 반경 6371km를 기준으로 두 좌표 사이의 거리를 계산)
        //        NumberExpression<Double> distanceExpression = Expressions.numberTemplate(Double.class,
        //                "6371 * acos(cos(radians({0})) * cos(radians({1})) * cos(radians({2}) - radians({3})) + sin(radians({0})) * sin(radians({1})))",
        //                userLat, recruit.latitude, recruit.longitude, userLng);

        //기준점으로 원
//        return queryFactory
//                .selectFrom(recruit)
//                .where(
//                        // 1. 위도/경도가 null이 아닌 데이터만
//                        recruit.latitude.isNotNull(),
//                        recruit.longitude.isNotNull(),
//
//                        distanceExpression.loe(radiusKm)
//                )
//                // 3. 거리가 가까운 순(오름차순)으로 정렬
//                .orderBy(distanceExpression.asc())
//                // 4. 최대 20개까지만 가져오기
//                .limit(20)
//                .fetch();
    }
}