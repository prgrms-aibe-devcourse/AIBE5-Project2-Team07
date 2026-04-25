package com.example.aibe5_project2_team7.business_profile.request;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BusinessCompanyEditRequestJsonTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void companyImageUrl_acceptsSnakeCaseField() throws Exception {
        String json = """
                {
                  "foundedDate": "2020-01-01",
                  "companyName": "테스트회사",
                  "businessNumber": "123-45-67890",
                  "companyPhone": "02-1234-5678",
                  "companyAddress": "서울 강남구",
                  "company_image_url": "https://cdn.example.com/company/logo.png"
                }
                """;

        BusinessCompanyEditRequest request = objectMapper.readValue(json, BusinessCompanyEditRequest.class);

        assertEquals("https://cdn.example.com/company/logo.png", request.getCompanyImageUrl());
    }

    @Test
    void brandId_acceptsSnakeCaseField() throws Exception {
        String json = """
                {
                  "foundedDate": "2020-01-01",
                  "companyName": "테스트회사",
                  "businessNumber": "123-45-67890",
                  "companyPhone": "02-1234-5678",
                  "companyAddress": "서울 강남구",
                  "brand_id": 12
                }
                """;

        BusinessCompanyEditRequest request = objectMapper.readValue(json, BusinessCompanyEditRequest.class);

        assertEquals(12L, request.getBrandId());
    }
}

