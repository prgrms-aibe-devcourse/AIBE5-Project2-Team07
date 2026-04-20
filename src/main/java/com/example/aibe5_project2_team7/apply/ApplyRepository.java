package com.example.aibe5_project2_team7.apply;

import com.example.aibe5_project2_team7.apply.entity.Apply;
import com.example.aibe5_project2_team7.apply.entity.ApplyType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface ApplyRepository extends JpaRepository<Apply, Long> {
    boolean existsByIndividualIdAndRecruitIdAndType(Long individualId, Long recruitId, ApplyType type);
    Optional<Apply> findByIndividualIdAndRecruitIdAndType(Long individualId, Long recruitId, ApplyType type);

    //회원이 한 모든 지원/제의
    List<Apply> findByIndividualId(Long individualId);
    List<Apply> findByIndividualIdAndType(Long individualId, ApplyType type);
    Page<Apply> findByIndividualIdAndType(Long individualId, ApplyType type, Pageable pageable);

    //특정 공고에 대한 모든 Apply
    List<Apply> findByRecruitId(Long recruitId);
    List<Apply> findByRecruitIdInAndType(Collection<Long> recruitIds, ApplyType type);
    Page<Apply> findByRecruitIdInAndType(Collection<Long> recruitIds, ApplyType type, Pageable pageable);
    Page<Apply> findByRecruitId(Long recruitId, Pageable pageable);

    //소유자 검증에 사용되는 단건 조회
    Optional<Apply> findByIdAndIndividualId(Long id, Long individualId);
    Optional<Apply> findByIdAndRecruitId(Long id, Long recruitId);
}
