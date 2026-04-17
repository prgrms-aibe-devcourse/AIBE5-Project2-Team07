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
    @Column(name = "member_id", nullable = false)
    private Long memberId;
    @ColumnDefault("false")
    @Column(name = "is_active")
    private Boolean isActive; // 실시간 활동 여부
    @ColumnDefault("false")
    @Column(name = "is_special")
    private Boolean isSpecial; // 스페셜 인재 여부 (리뷰 평균 4점 이상인 회원)
}
