package com.example.aibe5_project2_team7.individual_profile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DesiredBusinessTypeRepository extends JpaRepository<DesiredBusinessType, Long> {
    List<DesiredBusinessType> findByMemberId(Long memberId);

    @Query("select distinct d.memberId from DesiredBusinessType d where d.type in :types")
    List<Long> findDistinctMemberIdByTypeIn(@Param("types") List<String> types);

    void deleteByMemberId(Long memberId);
}
