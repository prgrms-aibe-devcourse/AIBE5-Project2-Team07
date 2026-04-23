package com.example.aibe5_project2_team7.recruit.repository;

import com.example.aibe5_project2_team7.recruit.entity.WorkTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkTimeRepository extends JpaRepository<WorkTime, Long> {
    List<WorkTime> findByRecruitIdIn(List<Long> recruitIds);
}