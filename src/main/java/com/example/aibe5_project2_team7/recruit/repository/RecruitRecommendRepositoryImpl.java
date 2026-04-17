package com.example.aibe5_project2_team7.recruit.repository;

import com.example.aibe5_project2_team7.recruit.Recruit;
import com.example.aibe5_project2_team7.recruit.constant.RecruitStatus;
import com.example.aibe5_project2_team7.recruit.dto.RecruitDto;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;
import static com.example.aibe5_project2_team7.recruit.QRecruit.recruit;
@RequiredArgsConstructor
public class RecruitRecommendRepositoryImpl implements RecruitRecommendRepository{
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<Recruit> getRecommendFieldSearch(RecruitDto recruitDto) {
        NumberExpression<Integer> score =
                businessTypeScore(recruitDto)
                        .add(dayScore(recruitDto))
                        .add(timeScore(recruitDto))
                        .add(salaryTypeScore(recruitDto))
                        .add(periodScore(recruitDto))
                        .add(urgentScore(recruitDto));

        return jpaQueryFactory
                .selectFrom(recruit)
                .where(
                        recruit.recruitStatus.eq(RecruitStatus.OPEN),
                        hasAnyCondition(recruitDto) ? score.gt(0) : null
                )
                .orderBy(score.desc(), recruit.id.desc())
                .limit(20)
                .fetch();
    }

    private boolean hasAnyCondition(RecruitDto dto) {
        return dto.getBusinessTypeName() != null
                || dto.getDays() != null
                || dto.getTimes() != null
                || dto.getSalaryType() != null
                || dto.getPeriod() != null
                || dto.getIsUrgent() != null;
    }

    private NumberExpression<Integer> businessTypeScore(RecruitDto dto) {
        if (dto.getBusinessTypeName() == null) {
            return Expressions.asNumber(0);
        }
        return new CaseBuilder()
                .when(recruit.businessTypeName.eq(dto.getBusinessTypeName())).then(5)
                .otherwise(0);
    }

    private NumberExpression<Integer> dayScore(RecruitDto dto) {
        if (dto.getDays() == null) {
            return Expressions.asNumber(0);
        }
        return new CaseBuilder()
                .when(recruit.days.eq(dto.getDays())).then(4)
                .otherwise(0);
    }

    private NumberExpression<Integer> timeScore(RecruitDto dto) {
        if (dto.getTimes() == null) {
            return Expressions.asNumber(0);
        }
        return new CaseBuilder()
                .when(recruit.times.eq(dto.getTimes())).then(4)
                .otherwise(0);
    }

    private NumberExpression<Integer> salaryTypeScore(RecruitDto dto) {
        if (dto.getSalaryType() == null) {
            return Expressions.asNumber(0);
        }
        return new CaseBuilder()
                .when(recruit.salaryType.eq(dto.getSalaryType())).then(3)
                .otherwise(0);
    }

    private NumberExpression<Integer> periodScore(RecruitDto dto) {
        if (dto.getPeriod() == null) {
            return Expressions.asNumber(0);
        }
        return new CaseBuilder()
                .when(recruit.period.eq(dto.getPeriod())).then(2)
                .otherwise(0);
    }

    private NumberExpression<Integer> urgentScore(RecruitDto dto) {
        if (dto.getIsUrgent() == null) {
            return Expressions.asNumber(0);
        }
        return new CaseBuilder()
                .when(recruit.isUrgent.eq(dto.getIsUrgent())).then(1)
                .otherwise(0);
    }
}
