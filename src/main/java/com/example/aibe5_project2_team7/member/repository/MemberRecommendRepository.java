package com.example.aibe5_project2_team7.member.repository;

import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.dto.MemberResponseDto;

import java.util.List;

public interface MemberRecommendRepository {

    List<MemberResponseDto> findByMemberAvgAsc(int score);
}
