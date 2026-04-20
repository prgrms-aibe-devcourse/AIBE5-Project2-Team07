package com.example.aibe5_project2_team7.recruit.entity;

import com.example.aibe5_project2_team7.brand.entity.Brand;
import com.example.aibe5_project2_team7.common.BaseEntity;
import com.example.aibe5_project2_team7.recruit.constant.RecruitStatus;
import com.example.aibe5_project2_team7.recruit.constant.SalaryType;
import com.example.aibe5_project2_team7.region.Region;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@ToString(exclude = {"brand", "region", "workPeriod", "workDays", "workTime", "businessType"})
public class Recruit extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "business_member_id", nullable = false)
    private Long businessMemberId; //공고를 등록한 사업자

    @Column(nullable = false)
    private String title; //제목

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand; //브랜드 여부 (null 가능)

    @Column(name = "is_urgent", nullable = false)
    private boolean isUrgent; //대타 공고 여부

    @Enumerated(EnumType.STRING)
    @Column(name = "recruit_status", nullable = false)
    private RecruitStatus status; //공고 상태

    @Column(nullable = false)
    private LocalDate deadline; //마감일, (대타 공고일 경우 근로일)

    @Column(nullable = false)
    private int salary; //급여

    @Enumerated(EnumType.STRING)
    private SalaryType salaryType; //급여 타입

    private Integer headCount; //모집 인원, Null=무제한

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region; //근무지 지역

    @Column(name = "detail_address", nullable = false)
    private String detailAddress; //근무지 상세주소

    @OneToMany(mappedBy = "recruit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkPeriod> workPeriod = new ArrayList<>(); //근무기간

    @OneToMany(mappedBy = "recruit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkDays> workDays = new ArrayList<>(); //근무요일

    @OneToMany(mappedBy = "recruit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkTime> workTime = new ArrayList<>(); //근무시간

    @OneToMany(mappedBy = "recruit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BusinessType> businessType = new ArrayList<>(); //업종

    private String description; //상세요강

    @Column(name = "resume_form_url")
    private String resumeFormUrl; //기업 이력서 양식 첨부파일 경로

    //    private LocalDateTime createdAt;
    //    private LocalDateTime updatedAt;
}
