package com.example.aibe5_project2_team7.recruit.entity;

import com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class BusinessType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruit_id")
    private Recruit recruit; // recruit_id FK

    @Enumerated(EnumType.STRING)
    private BusinessTypeName type;
}