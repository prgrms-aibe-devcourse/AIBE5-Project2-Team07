package com.example.aibe5_project2_team7.scrap_recruit;

import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.repository.MemberRepository;
import com.example.aibe5_project2_team7.recruit.RecruitRepository;
import com.example.aibe5_project2_team7.recruit.RecruitService;
import com.example.aibe5_project2_team7.recruit.dto.RecruitListResponseDto;
import com.example.aibe5_project2_team7.recruit.entity.Recruit;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ScrapRecruitService {
    private final ScrapRecruitRepository scrapRecruitRepository;
    private final MemberRepository memberRepository;
    private final RecruitRepository recruitRepository;
    private final RecruitService recruitService; // 공고 DTO 변환 재사용

    // 스크랩 공고 추가
    public void addScrapRecruit(Long memberId, Long recruitId) {
        if (scrapRecruitRepository.existsByMemberIdAndRecruitId(memberId, recruitId)) {
            throw new IllegalArgumentException("이미 스크랩한 공고입니다.");
        }
        Member member = memberRepository.findById(memberId)
                .orElseThrow(EntityNotFoundException::new);
        Recruit recruit = recruitRepository.findById(recruitId)
                .orElseThrow(EntityNotFoundException::new);

        scrapRecruitRepository.save(
                ScrapRecruit.builder()
                        .member(member).recruit(recruit).build()
        );
    }

    // 스크랩 공고 삭제
    public void removeScrapRecruit(Long memberId, Long recruitId) {
        ScrapRecruit scrapRecruit = scrapRecruitRepository
                .findByMemberIdAndRecruitId(memberId, recruitId)
                .orElseThrow(EntityNotFoundException::new);
        scrapRecruitRepository.delete(scrapRecruit);
    }

    // 스크랩 공고 목록 조회
    // - 공고 목록 DTO 변환은 RecruitService.toListResponse() 재사용
    // - 상세 보기는 기존 GET /recruits/{recruitId} API를 그대로 사용
    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<ScrapRecruitResponse> getMyScrapRecruitList(Long memberId, int page) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(Math.max(page, 0), 20, org.springframework.data.domain.Sort.by("id").descending());

        return scrapRecruitRepository.findAllByMemberIdWithRecruit(memberId, pageable)
                .map(scrap -> {
                    RecruitListResponseDto dto = recruitService.toListResponse(scrap.getRecruit());
                    return new ScrapRecruitResponse(scrap.getId(), dto);
                });
    }

    // 특정 회원의 스크랩 개수 조회
    @Transactional(readOnly = true)
    public long countMyScrap(Long memberId) {
        return scrapRecruitRepository.countByMemberId(memberId);
    }
}
