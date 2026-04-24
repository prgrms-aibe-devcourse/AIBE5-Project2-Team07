package com.example.aibe5_project2_team7.business_profile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BusinessProfileRepository extends JpaRepository<BusinessProfile, Long> {
    @Query("SELECT bp FROM BusinessProfile bp WHERE bp.memberId = :memberId")
    Optional<BusinessProfile> findByMemberId(@Param("memberId") Long memberId);

}
