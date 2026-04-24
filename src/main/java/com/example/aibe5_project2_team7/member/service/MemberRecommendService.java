package com.example.aibe5_project2_team7.member.service;

import com.example.aibe5_project2_team7.member.dto.MemberResponseDto;
import com.example.aibe5_project2_team7.member.repository.MemberRecommendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberRecommendService {
    private final MemberRecommendRepository memberRecommendRepository;

    public List<MemberResponseDto> findByMemberAvgAsc(int score){
        return memberRecommendRepository.findByMemberAvgAsc(score);
    }
}
