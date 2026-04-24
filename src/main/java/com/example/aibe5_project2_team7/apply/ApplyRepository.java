package com.example.aibe5_project2_team7.apply;

import com.example.aibe5_project2_team7.apply.entity.Apply;
import com.example.aibe5_project2_team7.apply.entity.ApplyStatus;
import com.example.aibe5_project2_team7.apply.entity.ApplyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ApplyRepository extends JpaRepository<Apply, Long> {

    boolean existsByIndividualIdAndRecruitIdAndType(Long individualId, Long recruitId, ApplyType type);
    Optional<Apply> findByIndividualIdAndRecruitIdAndType(Long individualId, Long recruitId, ApplyType type);

    // 개인 회원용

    // 지원/제의 목록 (타입 필터)
    Page<Apply> findByIndividualIdAndType(Long individualId, ApplyType type, Pageable pageable);

    // 근무 관리 / 리뷰 관리 — 전체 탭 (type 없음)
    Page<Apply> findByIndividualIdAndStatus(Long individualId, ApplyStatus status, Pageable pageable);

    // 근무 관리 / 리뷰 관리 — 지원/제의 탭 (type 있음)
    Page<Apply> findByIndividualIdAndStatusAndType(Long individualId, ApplyStatus status, ApplyType type, Pageable pageable);

    // 사업자 회원용

    // 받은 지원 / 보낸 제의 목록
    Page<Apply> findByRecruitIdInAndType(Collection<Long> recruitIds, ApplyType type, Pageable pageable);

    // 근무 관리 / 리뷰 관리 — 전체 탭 (type 없음)
    @Query("SELECT a FROM Apply a WHERE a.recruitId IN :recruitIds AND a.status = :status")
    Page<Apply> findByRecruitIdInAndStatus(
            @Param("recruitIds") Collection<Long> recruitIds,
            @Param("status") ApplyStatus status,
            Pageable pageable
    );

    // 근무 관리 / 리뷰 관리 — 지원/제의 탭 (type 있음)
    @Query("SELECT a FROM Apply a WHERE a.recruitId IN :recruitIds AND a.status = :status AND a.type = :type")
    Page<Apply> findByRecruitIdInAndStatusAndType(
            @Param("recruitIds") Collection<Long> recruitIds,
            @Param("status") ApplyStatus status,
            @Param("type") ApplyType type,
            Pageable pageable
    );

    // 특정 공고 단건 필터 (사업자가 recruitId 지정할 때)
    Page<Apply> findByRecruitId(Long recruitId, Pageable pageable);

    long countByRecruitIdAndStatusIn(Long recruitId, Collection<ApplyStatus> statuses);

    // ── 소유자 검증용 단건 조회 ────────────────────────────────────────────────

    Optional<Apply> findByIdAndIndividualId(Long id, Long individualId);
    Optional<Apply> findByIdAndRecruitId(Long id, Long recruitId);
}