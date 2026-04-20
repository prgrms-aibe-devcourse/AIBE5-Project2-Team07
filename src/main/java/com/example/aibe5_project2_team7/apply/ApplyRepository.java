package com.example.aibe5_project2_team7.apply;

import com.example.aibe5_project2_team7.apply.entity.Apply;
import com.example.aibe5_project2_team7.apply.entity.ApplyType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApplyRepository extends JpaRepository<Apply, Long> {
    boolean existsByIndividualIdAndRecruitIdAndType(Long individualId, Long recruitId, ApplyType type);
    Optional<Apply> findByIndividualIdAndRecruitIdAndType(Long individualId, Long recruitId, ApplyType type);
}
