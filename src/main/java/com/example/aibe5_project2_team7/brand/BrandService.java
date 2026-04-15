package com.example.aibe5_project2_team7.brand;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BrandService {
    private final BrandRepository brandRepository;

    @Transactional(readOnly = true)
    public List<BrandSearchAutoCompleteDto> getSearchList(String query) {
        List<Brand> brandList = new ArrayList<>();
        brandList = brandRepository.findTop4ByNameContainingIgnoreCaseOrderByNameAsc(query);
        List<BrandSearchAutoCompleteDto> brandSearchAutoCompleteDtoList = new ArrayList<>();
        for(Brand brand : brandList) {
            brandSearchAutoCompleteDtoList.add(BrandSearchAutoCompleteDto.of(brand));
        }
        return brandSearchAutoCompleteDtoList;
    }
}
