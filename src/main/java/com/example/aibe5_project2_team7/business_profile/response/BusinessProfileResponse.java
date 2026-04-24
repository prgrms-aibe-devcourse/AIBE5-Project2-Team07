package com.example.aibe5_project2_team7.business_profile.response;

import com.example.aibe5_project2_team7.business_profile.BusinessProfile;
import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member_address.MemberAddress;
//import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class BusinessProfileResponse {
    private Long id;
    private Long memberId;
    private String companyName;
    private LocalDate foundedDate;
    private String companyImageUrl;
    private Long brandId;
    private String businessNumber;
    private String companyPhone;
    private String companyAddress;
    private String homepageUrl;

    private String name;
    //@JsonProperty("birth_date")
    private LocalDate birthDate;
    private String gender;
    private String phone;
    private String email;
    //@JsonProperty("region_name")
    private String regionName;
    //@JsonProperty("detail_address")
    private String detailAddress;
    //@JsonProperty("created_at")
    private LocalDateTime createdAt;
    //@JsonProperty("updated_at")
    private LocalDateTime updatedAt;
    //@JsonProperty("rating_sum")
    private Integer ratingSum;
    //@JsonProperty("rating_count")
    private Integer ratingCount;
    //@JsonProperty("brand_id")
    private Long brandIdAlias;
    //@JsonProperty("brand_name")
    private String brandName;

    public static BusinessProfileResponse from(BusinessProfile profile, Member member, MemberAddress memberAddress, String brandName) {
        String regionName = null;
        String detailAddress = null;
        if (memberAddress != null && memberAddress.getRegion() != null) {
            regionName = memberAddress.getRegion().getSido() + " " + memberAddress.getRegion().getSigungu();
            detailAddress = memberAddress.getDetailAddress();
        }

        return BusinessProfileResponse.builder()
                .id(profile.getId())
                .memberId(profile.getMemberId())
                .companyName(profile.getCompanyName())
                .foundedDate(profile.getFoundedDate())
                .companyImageUrl(profile.getCompanyImageUrl())
                .brandId(profile.getBrandId() != null ? profile.getBrandId().getId() : null)
                .businessNumber(profile.getBusinessNumber())
                .companyPhone(profile.getCompanyPhone())
                .companyAddress(profile.getCompanyAddress())
                .homepageUrl(profile.getHomepageUrl())
                .name(member.getName())
                .birthDate(member.getBirthDate())
                .gender(member.getGender() != null ? member.getGender().name() : null)
                .phone(member.getPhone())
                .email(member.getEmail())
                .regionName(regionName)
                .detailAddress(detailAddress)
                .createdAt(member.getCreatedAt())
                .updatedAt(member.getUpdatedAt())
                .ratingSum(member.getRatingSum())
                .ratingCount(member.getRatingCount())
                .brandIdAlias(profile.getBrandId() != null ? profile.getBrandId().getId() : null)
                .brandName(brandName)
                .build();
    }
}

