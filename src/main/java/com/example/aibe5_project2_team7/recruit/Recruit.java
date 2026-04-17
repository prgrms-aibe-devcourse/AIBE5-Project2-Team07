package com.example.aibe5_project2_team7.recruit;

import com.example.aibe5_project2_team7.recruit.constant.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Recruit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean isUrgent;
    @Enumerated(EnumType.STRING)
    private BusinessTypeName businessTypeName;

    @Enumerated(EnumType.STRING)
    private Days days;
    @Enumerated(EnumType.STRING)
    private Period period;
    @Enumerated(EnumType.STRING)
    private RecruitStatus recruitStatus;

    @Enumerated(EnumType.STRING)
    private SalaryType salaryType;

    @Enumerated(EnumType.STRING)
    private Times times;




}
