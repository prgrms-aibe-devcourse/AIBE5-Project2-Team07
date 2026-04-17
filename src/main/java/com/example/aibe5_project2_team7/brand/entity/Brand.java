package com.example.aibe5_project2_team7.brand.entity;

import com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name="Brand")
@Getter
@Setter
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;

    @Column(name = "business_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private BusinessTypeName businessType;

    @Column(name = "logo_img")
    private String logoImg;

    @Column(name = "ceo_name", nullable = false)
    private String ceoName;

    @Column(name = "hq_address", nullable = false)
    private String hqAddress;

    @Column(name = "founded_date", nullable = false)
    private LocalDate foundedDate;
}
