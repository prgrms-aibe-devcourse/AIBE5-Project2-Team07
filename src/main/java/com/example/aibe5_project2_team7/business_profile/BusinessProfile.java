package com.example.aibe5_project2_team7.business_profile;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter@Setter
public class BusinessProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "member_id", nullable = false)
    private Long memberId;
    @Column(name = "company_name", nullable = false)
    private String companyName;
    @Column(name = "founded_date", nullable = false)
    private LocalDate foundedDate;
    @Column(name = "company_image_url")
    private String companyImageUrl;
    @Column(name = "brand_id")
    private Long brandId; // null 가능
    @Column(name = "business_number", nullable = false)
    private String businessNumber; //사업자등록번호
    @Column(name = "company_phone", nullable = false)
    private String companyPhone;
    @Column(name = "company_address", nullable = false)
    private String companyAddress;
    @Column(name = "homepage_url")
    private String homepageUrl;
}
