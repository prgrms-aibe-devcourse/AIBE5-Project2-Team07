package com.example.aibe5_project2_team7.resume;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter@Setter
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long member_id;
    @Column(nullable = false)
    private String title;
    private Boolean visibility; // 이력서 공개 여부
    private String content; // 이력서 내용
}
