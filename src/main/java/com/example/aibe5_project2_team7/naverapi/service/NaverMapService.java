package com.example.aibe5_project2_team7.naverapi.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;



@Slf4j
@Service
public class NaverMapService {

    @Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public double[] getCoordinates(String address) {
        // 1. 네이버 Geocoding API URL (파라미터로 주소 전달)
        String apiUrl = "https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=" + address;

        // 2. http 헤더키 인증
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-ncp-apigw-api-key-id", clientId);
        headers.set("x-ncp-apigw-api-key", clientSecret);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 네이버 요청 전송
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class);

            // 4. 받아온 JSON 응답 분석
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode addresses = root.path("addresses");

            // 5. 검색 결과가 있다면 첫 번째 결과의 x, y 값을 추출
            if (addresses.isArray() && addresses.size() > 0) {
                JsonNode firstResult = addresses.get(0);

                double lng = firstResult.path("x").asDouble(); // 경도 (x)
                double lat = firstResult.path("y").asDouble(); // 위도 (y)

                log.info("📍 좌표 변환 성공 [{}]: 위도({}), 경도({})", address, lat, lng);
                return new double[]{lat, lng};
            } else {
                log.warn("🚨 주소를 찾을 수 없습니다: {}", address);
            }
        } catch (Exception e) {
            log.error("🚨 네이버 API 호출 중 통신 에러 발생", e);
        }

        return null;
    }
}
