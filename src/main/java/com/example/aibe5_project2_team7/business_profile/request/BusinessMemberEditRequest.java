package com.example.aibe5_project2_team7.business_profile.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BusinessMemberEditRequest {
    private String phone;
    private Integer regionId;
    private String detailAddress;
}

