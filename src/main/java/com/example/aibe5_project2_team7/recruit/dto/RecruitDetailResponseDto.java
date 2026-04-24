package com.example.aibe5_project2_team7.recruit.dto;

import com.example.aibe5_project2_team7.recruit.constant.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class RecruitDetailResponseDto { //공고 상세 조회할 때
    private Long id;
    private String title;
    private String companyName;         // 기업명
    private List<BusinessTypeName> businessType; // 업종
    private String logoImg;             // 기업 로고 이미지 URL
    private boolean isUrgent;
    private RecruitStatus status;
    private int salary;
    private SalaryType salaryType;
    private List<Period> workPeriod;
    private List<Days> workDays;
    private List<Times> workTime;
    private Integer headCount;
    private LocalDate deadline;
    private String fullAddress;
    private String description;
    private String resumeFormUrl;       // attached_file_url
    private Long brandId;
    private String brandName;           // Long → String 수정
    private String companyPhone;        // 회사 전화번호
    private String homepageUrl;         // 홈페이지 URL
    private ReviewSummaryDto reviewSummary; // 리뷰 요약 (중첩 DTO)
    private String applyStatus;         // 로그인 유저의 지원 상태
    private Double latitude;   // 위도
    private Double longitude;  // 경도
    private Long businessMemberId; // 작성한 사업자 멤버 아이디

}
