package com.example.aibe5_project2_team7.brand.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BrandRecruitListResponse<T> {
    private List<T> recruits;
    private long total_count;
    private long totalCount;
    private int currentPage;
    private int totalPages;
    private int pageSize;

    public BrandRecruitListResponse() {}

    public BrandRecruitListResponse(List<T> recruits, long total_count) {
        this.recruits = recruits;
        this.total_count = total_count;
        this.totalCount = total_count;
    }

    public BrandRecruitListResponse(List<T> recruits, long total_count, int currentPage, int totalPages, int pageSize) {
        this.recruits = recruits;
        this.total_count = total_count;
        this.totalCount = total_count;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.pageSize = pageSize;
    }
}

