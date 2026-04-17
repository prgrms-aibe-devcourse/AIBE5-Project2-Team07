package com.example.aibe5_project2_team7.recruit.entity;

import com.example.aibe5_project2_team7.recruit.constant.Times;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        uniqueConstraints = @UniqueConstraint(
                name = "uk_work_time_recruit_times",
                columnNames = {"recruit_id", "times"}
        )
)
@Getter @Setter
public class WorkTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruit_id")
    private Recruit recruit; // recruit_id FK

    @Enumerated(EnumType.STRING)
    private Times times; //Morning, Afternoon, Evening...
}
