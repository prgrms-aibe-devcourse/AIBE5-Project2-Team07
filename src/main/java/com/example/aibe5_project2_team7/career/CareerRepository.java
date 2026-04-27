package com.example.aibe5_project2_team7.career;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CareerRepository extends JpaRepository<Career, Long> {
    List<Career> findByMemberId(Long memberId);

    @Query("select distinct c.memberId from Career c where c.brandId in :brandIds")
    List<Long> findDistinctMemberIdByBrandIdIn(@Param("brandIds") List<Long> brandIds);
}
