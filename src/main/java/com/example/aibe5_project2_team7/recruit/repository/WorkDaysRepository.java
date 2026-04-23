package com.example.aibe5_project2_team7.recruit.repository;

import com.example.aibe5_project2_team7.recruit.entity.WorkDays;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkDaysRepository extends JpaRepository<WorkDays, Long> {
    List<WorkDays> findByRecruitIdIn(List<Long> recruitIds);
}