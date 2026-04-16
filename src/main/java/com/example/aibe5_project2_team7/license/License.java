package com.example.aibe5_project2_team7.license;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter@Setter
public class License {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "member_id", nullable = false)
    private Long memberId;
    @Column(nullable = false)
    private String licenseName;
    @Column(nullable = false)
    private String licenseNumber;
    @Column(nullable = false)
    private LocalDate acquisitionDate;
    private String issuedBy;
    private String licenseFileUrl;
}
