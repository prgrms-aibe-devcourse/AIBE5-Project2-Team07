package com.example.aibe5_project2_team7.member.repository;

import com.example.aibe5_project2_team7.member.MemberType;
import com.example.aibe5_project2_team7.member.dto.MemberResponseDto;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.example.aibe5_project2_team7.member.QMember.member;

@RequiredArgsConstructor
@Repository
public class MemberRecommendRepositoryImpl implements MemberRecommendRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<MemberResponseDto> findByMemberAvgAsc(int score) {

        NumberExpression<Double> avgRating = new CaseBuilder()
                .when(member.ratingCount.isNull().or(member.ratingCount.eq(0))).then(0.0)
                .otherwise(
                        member.ratingSum.coalesce(0).doubleValue()
                                .divide(member.ratingCount.coalesce(1).doubleValue())
                );

        return queryFactory
                .select(Projections.fields(MemberResponseDto.class,
                        member.id,
                        member.name,
                        member.birthDate,
                        member.gender,
                        member.phone,
                        member.email,
                        member.image,
                        member.password,
                        member.memberType,
                        member.ratingSum,
                        member.ratingCount,
                        avgRating.as("avgScore")
                ))
                .from(member)
                .where(member.memberType.eq(MemberType.INDIVIDUAL),
                        scoreCondition(score, avgRating))
                .orderBy(avgRating.desc(), member.ratingCount.desc(), member.id.asc())
                .limit(20)
                .fetch();
    }

    private BooleanExpression scoreCondition(int score, NumberExpression<Double> avgRating) {
        if (score < 0) {
            return null; // 전체 조회
        }

        return avgRating.goe((double) score)
                .and(avgRating.lt((double) score + 1));
    }
}