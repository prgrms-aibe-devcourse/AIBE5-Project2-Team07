package com.example.aibe5_project2_team7.member.repository;

import com.example.aibe5_project2_team7.member.dto.MemberResponseDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class MemberRecommendRepositoryImplTest {
    @Autowired
    MemberRecommendRepository memberRecommendRepository;

    @Test
    public void showMembers(){
        List<MemberResponseDto> list = memberRecommendRepository.findByMemberAvgAsc(-1);

        System.out.println("list size : "+list.size());
        for(MemberResponseDto dto :list){
            System.out.println(dto);
        }
    }


}