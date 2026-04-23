package com.example.aibe5_project2_team7.recruit;

import com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName;
import com.example.aibe5_project2_team7.recruit.constant.Days;
import com.example.aibe5_project2_team7.recruit.constant.Period;
import com.example.aibe5_project2_team7.recruit.constant.RecruitStatus;
import com.example.aibe5_project2_team7.recruit.constant.Times;
import com.example.aibe5_project2_team7.recruit.entity.Recruit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RecruitRepository extends JpaRepository<Recruit, Long> {
    List<Recruit> findByBusinessMemberId(Long businessMemberId);

    // 필터 조건 조회 (동적 쿼리)
    @Query(value = "SELECT DISTINCT r FROM Recruit r " +
            "LEFT JOIN r.workPeriod wp " +
            "LEFT JOIN r.workDays wd " +
            "LEFT JOIN r.workTime wt " +
            "LEFT JOIN r.businessType bt " +
            "WHERE (:type IS NULL OR :type = 'ALL' " +
            "   OR (:type = 'SHORT' AND EXISTS (SELECT 1 FROM r.workPeriod wp2 WHERE wp2.period = com.example.aibe5_project2_team7.recruit.constant.Period.OneDay)) " +
            "   OR (:type = 'LONG'  AND NOT EXISTS (SELECT 1 FROM r.workPeriod wp2 WHERE wp2.period = com.example.aibe5_project2_team7.recruit.constant.Period.OneDay))) " +
            "AND (:keyword IS NULL OR r.title LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:regionId IS NULL OR r.region.id = :regionId) " +
            "AND (:workDate IS NULL OR r.deadline = :workDate) " +
            "AND (:workPeriod IS NULL OR wp.period IN :workPeriod) " +
            "AND (:workDays IS NULL OR wd.day IN :workDays) " +
            "AND (:workTime IS NULL OR wt.times IN :workTime) " +
            "AND (:businessType IS NULL OR bt.type IN :businessType) " +
            "AND (:memberId IS NULL OR r.businessMemberId = :memberId) " +
            "AND (:isUrgent = false OR r.isUrgent = true) " +
            "AND (:excludeStatus IS NULL OR r.status <> :excludeStatus)",
            countQuery = "SELECT COUNT(DISTINCT r.id) FROM Recruit r " +
            "LEFT JOIN r.workPeriod wp " +
            "LEFT JOIN r.workDays wd " +
            "LEFT JOIN r.workTime wt " +
            "LEFT JOIN r.businessType bt " +
            "WHERE (:type IS NULL OR :type = 'ALL' " +
            "   OR (:type = 'SHORT' AND EXISTS (SELECT 1 FROM r.workPeriod wp2 WHERE wp2.period = com.example.aibe5_project2_team7.recruit.constant.Period.OneDay)) " +
            "   OR (:type = 'LONG'  AND NOT EXISTS (SELECT 1 FROM r.workPeriod wp2 WHERE wp2.period = com.example.aibe5_project2_team7.recruit.constant.Period.OneDay))) " +
            "AND (:keyword IS NULL OR r.title LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:regionId IS NULL OR r.region.id = :regionId) " +
            "AND (:workDate IS NULL OR r.deadline = :workDate) " +
            "AND (:workPeriod IS NULL OR wp.period IN :workPeriod) " +
            "AND (:workDays IS NULL OR wd.day IN :workDays) " +
            "AND (:workTime IS NULL OR wt.times IN :workTime) " +
            "AND (:businessType IS NULL OR bt.type IN :businessType) " +
            "AND (:memberId IS NULL OR r.businessMemberId = :memberId) " +
            "AND (:isUrgent = false OR r.isUrgent = true) " +
            "AND (:excludeStatus IS NULL OR r.status <> :excludeStatus)")
    Page<Recruit> findWithFilters(
            @Param("type") String type,
            @Param("keyword") String keyword,
            @Param("regionId") Integer regionId,
            @Param("workDate") LocalDate workDate,
            @Param("workPeriod") List<Period> workPeriod,
            @Param("workDays") List<Days> workDays,
            @Param("workTime") List<Times> workTime,
            @Param("businessType") List<BusinessTypeName> businessType,
            @Param("memberId") Long memberId,
            @Param("isUrgent") boolean isUrgent,
            @Param("excludeStatus") RecruitStatus excludeStatus,
            Pageable pageable
    );

    @Query("SELECT r.id FROM Recruit r WHERE r.businessMemberId = :businessMemberId")
    List<Long> findIdsByBusinessMemberId(@Param("businessMemberId") Long businessMemberId);
}
