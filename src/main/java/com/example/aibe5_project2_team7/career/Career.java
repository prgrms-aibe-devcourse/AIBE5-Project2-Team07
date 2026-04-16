package com.example.aibe5_project2_team7.career;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter@Setter
public class Career {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long member_id;
    private Long brand_id; // null 가능
    @Column(nullable = false)
    private String company;
    @Column(nullable = false)
    private String role;
    @Column(nullable = false)
    private LocalDate staartDate;
    private LocalDate endDate; // null 가능
}
