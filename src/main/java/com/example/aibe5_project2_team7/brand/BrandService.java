package com.example.aibe5_project2_team7.brand;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BrandService {
    private final BrandRepository brandRepository;

    public List<BrandSearchAutoCompleteDto> getSearchList(String query) {
        List<Brand> brandList;
        brandList = brandRepository.findTop4ByNameContainingIgnoreCaseOrderByNameAsc(query);
        List<BrandSearchAutoCompleteDto> brandSearchAutoCompleteDtoList = new ArrayList<>();
        for(Brand brand : brandList) {
            brandSearchAutoCompleteDtoList.add(BrandSearchAutoCompleteDto.of(brand));
        }
        return brandSearchAutoCompleteDtoList;
    }

    public List<BrandRandomDto> getRandom8Brands() {
        List<Brand> brandList = brandRepository.findRandom8Brands();
        List<BrandRandomDto> brandRandomDtoList = new ArrayList<>();
        for(Brand brand : brandList) {
            brandRandomDtoList.add(BrandRandomDto.of(brand));
        }
        return brandRandomDtoList;
    }

    public List<BrandRecruitCountDto> getBrandAndRecruitCounts(com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName businessType) {
        return brandRepository.findRecruitCountsByBusinessType(businessType);
    }

    public List<BrandUrgentDto> getRandom3UrgentBrands() {
        List<BrandUrgentProjection> rows = brandRepository.findRandom3UrgentBrandsNative();
        List<BrandUrgentDto> results = new ArrayList<>();
        for (BrandUrgentProjection p : rows) {
            Long id = p.getBrand_id();
            String name = p.getBrand_name();
            Long urgentCount = p.getUrgent_count() != null ? p.getUrgent_count() : 0L;
            results.add(new BrandUrgentDto(id, name, urgentCount));
        }
        return results;
    }
}
