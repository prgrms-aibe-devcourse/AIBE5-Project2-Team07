package com.example.aibe5_project2_team7.business_profile;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Entity
@Getter@Setter
public class BusinessProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long member_id;
    @Column(nullable = false)
    private String companyName;
    @Column(nullable = false)
    private LocalDate foundedDate;
    private String companyImageUrl;
    private Long brandId; // null 가능
    @Column(nullable = false)
    private String businessNumber; //사업자등록번호
    @Column(nullable = false)
    private String companyPhone;
    @Column(nullable = false)
    private String companyAddress;
    private String homepageUrl;
}
