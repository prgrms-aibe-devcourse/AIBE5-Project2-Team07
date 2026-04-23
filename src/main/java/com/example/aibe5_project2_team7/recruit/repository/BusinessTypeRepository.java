package com.example.aibe5_project2_team7.recruit.repository;


import com.example.aibe5_project2_team7.recruit.entity.BusinessType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusinessTypeRepository extends JpaRepository<BusinessType, Long> {
    List<BusinessType> findByRecruitIdIn(List<Long> recruitIds);
}