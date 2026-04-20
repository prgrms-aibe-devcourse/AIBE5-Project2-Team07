package com.example.aibe5_project2_team7.scrap_member;

import com.example.aibe5_project2_team7.business_profile.BusinessProfile;
import com.example.aibe5_project2_team7.business_profile.BusinessProfileRepository;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfile;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfileRepository;
import com.example.aibe5_project2_team7.resume.ResumeService;
import com.example.aibe5_project2_team7.resume.dto.ResumeSummaryDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ScrapMemberService {
    private final ScrapMemberRepository scrapMemberRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final IndividualProfileRepository individualProfileRepository;
    private final ResumeService resumeService;

    // 스크랩 추가
    public void addScrapMember(Long businessProfileId, Long individualProfileId) {
        if (scrapMemberRepository.existsByBusinessProfileIdAndIndividualProfileId(
                businessProfileId, individualProfileId)) {
            throw new IllegalArgumentException("이미 스크랩한 회원입니다.");
        }
        BusinessProfile business = businessProfileRepository.findById(businessProfileId)
                .orElseThrow(EntityNotFoundException::new);
        IndividualProfile individual = individualProfileRepository.findById(individualProfileId)
                .orElseThrow(EntityNotFoundException::new);

        scrapMemberRepository.save(
                ScrapMember.builder()
                        .businessProfile(business)
                        .individualProfile(individual)
                        .build()
        );
    }

    // 스크랩 취소
    public void removeScrapMember(Long businessProfileId, Long individualProfileId) {
        ScrapMember scrapMember = scrapMemberRepository
                .findByBusinessProfileIdAndIndividualProfileId(businessProfileId, individualProfileId)
                .orElseThrow(EntityNotFoundException::new);
        scrapMemberRepository.delete(scrapMember);
    }

    // 스크랩 목록 조회
    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<ResumeSummaryDto> getScrapMemberList(Long businessProfileId, int page) {
        List<ScrapMember> scraps = scrapMemberRepository
                .findAllByBusinessProfileIdWithIndividual(businessProfileId);

        List<Long> memberIds = scraps.stream()
                .map(s -> s.getIndividualProfile().getMemberId())
                .toList();

        // 고정 페이지 사이즈: 20
        return resumeService.getResumesByMemberIds(memberIds, page, 20);
    }

    // 스크랩 개수 조회
    @Transactional(readOnly = true)
    public long countScrapMember(Long businessProfileId) {
        return scrapMemberRepository.countByBusinessProfileId(businessProfileId);
    }
}