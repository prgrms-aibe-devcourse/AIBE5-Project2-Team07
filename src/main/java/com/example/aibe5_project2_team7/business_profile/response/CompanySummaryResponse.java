package com.example.aibe5_project2_team7.business_profile.response;

import com.example.aibe5_project2_team7.business_profile.BusinessProfile;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CompanySummaryResponse {
    private Long id;
    private String companyName;
    private String businessNumber;

    public static CompanySummaryResponse from(BusinessProfile profile) {
        CompanySummaryResponse r = new CompanySummaryResponse();
        if (profile == null) return r;
        r.setId(profile.getId());
        r.setCompanyName(profile.getCompanyName());
        r.setBusinessNumber(profile.getBusinessNumber());
        return r;
    }
}

