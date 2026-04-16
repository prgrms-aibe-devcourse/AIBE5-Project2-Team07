package com.example.aibe5_project2_team7.brand;

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

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BusinessTypeName business_type;

    @Column
    private String logo_img;

    @Column(nullable = false)
    private String ceo_name;

    @Column(nullable = false)
    private String hq_address;

    @Column(nullable = false)
    private LocalDate founded_date;
}
