package com.example.aibe5_project2_team7.brand.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BrandRecruitListResponse<T> {
    private List<T> recruits;
    private long total_count;

    public BrandRecruitListResponse() {}

    public BrandRecruitListResponse(List<T> recruits, long total_count) {
        this.recruits = recruits;
        this.total_count = total_count;
    }
}

