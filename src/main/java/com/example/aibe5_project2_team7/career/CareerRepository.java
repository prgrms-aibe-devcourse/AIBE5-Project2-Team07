package com.example.aibe5_project2_team7.career;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CareerRepository extends JpaRepository<Career, Long> {
    List<Career> findByMemberId(Long memberId);
}
