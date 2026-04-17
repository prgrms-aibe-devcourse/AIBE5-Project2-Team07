package com.example.aibe5_project2_team7.recruit.entity;

import com.example.aibe5_project2_team7.recruit.constant.Days;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        uniqueConstraints = @UniqueConstraint(
                name = "uk_work_days_recruit_day",
                columnNames = {"recruit_id", "day"}
        )
)
@Getter @Setter
public class WorkDays {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruit_id", nullable = false)
    private com.example.aibe5_project2_team7.recruit.entity.Recruit recruit; // recruit_id FK

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Days day; // MON, TUE, WED ...
}
