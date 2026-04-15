package com.example.aibe5_project2_team7.brand;

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
    private Integer business_type;

    private String logo_img;

    @Column(nullable = false)
    private String ceo_name;

    @Column(nullable = false)
    private String hq_address;

    @Column(nullable = false)
    private LocalDate founded_date;
}
