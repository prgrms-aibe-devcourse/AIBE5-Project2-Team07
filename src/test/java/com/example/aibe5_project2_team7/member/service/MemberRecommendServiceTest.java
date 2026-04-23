package com.example.aibe5_project2_team7.member.service;

import com.example.aibe5_project2_team7.member.dto.MemberResponseDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@Transactional
class MemberRecommendServiceTest {

    @Autowired
    MemberRecommendService memberRecommendService;

    @Test
    @DisplayName("유저추천")
    public void showMembers(){

        List<MemberResponseDto> list = memberRecommendService.findByMemberAvgAsc(3);

        for(MemberResponseDto dto :list){
            System.out.println(dto);
        }

    }
}