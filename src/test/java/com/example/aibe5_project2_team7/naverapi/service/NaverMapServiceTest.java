package com.example.aibe5_project2_team7.naverapi.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class NaverMapServiceTest {

    @Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;
    @Autowired
    private NaverMapService naverMapService;

    @Test
    @DisplayName("정상적인 주소를 입력하면 위도(lat)와 경도(lng) 배열을 반환한다")
    void getCoordinates_success() {
        // given
        // 네이버 본사(그린팩토리) 주소로 테스트해 봅니다.
        String address = "경기도 성남시 분당구 불정로 6";

        // when
        double[] coords = naverMapService.getCoordinates(address);

        // then
        assertThat(coords).isNotNull();
        assertThat(coords.length).isEqualTo(2); // 배열 크기가 2(위도, 경도)인지 확인

        System.out.println("=====================================");
        System.out.println("테스트 성공!");
        System.out.println("위도(lat, y): " + coords[0]);
        System.out.println("경도(lng, x): " + coords[1]);
        System.out.println("=====================================");
    }

    @Test
    @DisplayName("잘못된 주소나 빈 값을 입력하면 null을 반환한다")
    void getCoordinates_fail() {
        // given
        String invalidAddress = "존재하지않는우주어딘가주소";

        // when
        double[] coords = naverMapService.getCoordinates(invalidAddress);

        // then
        assertThat(coords).isNull();
    }

    @Test
    @DisplayName("스프링부트가 application.properties의 키를 정상적으로 읽어오는지 확인한다")
    void checkInjectedKeys() {
        System.out.println("=====================================");
        System.out.println("주입된 Client ID: " + clientId);
        System.out.println("주입된 Client Secret: " + clientSecret);
        System.out.println("=====================================");

        // 값이 null 이거나 "${NAVER_CLIENT_ID}" 라는 글자 그대로 들어왔다면 에러를 발생시킵니다.
        assertThat(clientId).isNotNull();
        assertThat(clientId).doesNotContain("${");
    }
}