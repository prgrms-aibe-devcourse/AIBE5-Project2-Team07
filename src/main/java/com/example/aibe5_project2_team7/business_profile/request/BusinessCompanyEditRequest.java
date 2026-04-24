package com.example.aibe5_project2_team7.business_profile.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BusinessCompanyEditRequest {
    private LocalDate foundedDate;
    private String companyName;
    private String businessNumber;
    private String companyPhone;
    private String homepageUrl;
    private String companyAddress;
}
