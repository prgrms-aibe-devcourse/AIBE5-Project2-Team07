package com.example.aibe5_project2_team7.recruit.repository;

import com.example.aibe5_project2_team7.recruit.entity.WorkPeriod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkPeriodRepository extends JpaRepository<WorkPeriod, Long> {
    List<WorkPeriod> findByRecruitIdIn(List<Long> recruitIds);

}