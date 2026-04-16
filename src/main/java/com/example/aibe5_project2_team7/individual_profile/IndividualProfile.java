package com.example.aibe5_project2_team7.individual_profile;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Entity
@Getter @Setter
public class IndividualProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long member_id;
    @ColumnDefault("false")
    private Boolean isActive; // 실시간 활동 여부
    @ColumnDefault("false")
    private Boolean isSpecial; // 스페셜 인재 여부 (리뷰 평균 4점 이상인 회원)
}
