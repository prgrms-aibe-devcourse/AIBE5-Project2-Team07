package com.example.aibe5_project2_team7.apply;

import com.example.aibe5_project2_team7.apply.dto.ApplyRequestDto;
import com.example.aibe5_project2_team7.apply.dto.ApplyResponseDto;
import com.example.aibe5_project2_team7.apply.dto.OfferRequestDto;
import com.example.aibe5_project2_team7.apply.entity.Apply;
import com.example.aibe5_project2_team7.apply.entity.ApplyMethod;
import com.example.aibe5_project2_team7.apply.entity.ApplyStatus;
import com.example.aibe5_project2_team7.apply.entity.ApplyType;
import com.example.aibe5_project2_team7.business_profile.BusinessProfile;
import com.example.aibe5_project2_team7.business_profile.BusinessProfileRepository;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfile;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfileRepository;
import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.MemberType;
import com.example.aibe5_project2_team7.member.repository.MemberRepository;
import com.example.aibe5_project2_team7.recruit.RecruitRepository;
import com.example.aibe5_project2_team7.recruit.constant.RecruitStatus;
import com.example.aibe5_project2_team7.recruit.entity.Recruit;
import com.example.aibe5_project2_team7.resume.Resume;
import com.example.aibe5_project2_team7.resume.ResumeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.objenesis.SpringObjenesis;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
public class ApplyService {
    private final ApplyRepository applyRepository;
    private final MemberRepository memberRepository;
    private final RecruitRepository recruitRepository;
    private final ResumeRepository resumeRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final IndividualProfileRepository individualProfileRepository;

    // 개인 회원이 공고에 지원하기
    @Transactional
    public ApplyResponseDto applyForRecruit(Long requesterMemberId, ApplyRequestDto requestDto) {
        // 로그인 체크
        if(requesterMemberId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        // 개인 회원 확인
        Member member = memberRepository.findById(requesterMemberId)
                .orElseThrow(EntityNotFoundException::new);
        if(member.getMemberType() != MemberType.INDIVIDUAL) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "사업자는 지원할 수 없습니다.");
        }

        // 약관 동의 체크
        if(requestDto.getAgree() == null || !requestDto.getAgree()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "약관에 동의해야 합니다.");
        }

        // 공고 존재 및 마감 확인
        Recruit recruit = recruitRepository.findById(requestDto.getRecruitId())
                .orElseThrow(EntityNotFoundException::new);
        if(recruit.getStatus() == RecruitStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "마감된 공고입니다.");
        }

        // 이력서 존재 확인
        Resume resume = resumeRepository.findById(requestDto.getResumeId())
                .orElseThrow(EntityNotFoundException::new);

        // 중복 지원 체크
        boolean exists = applyRepository.existsByIndividualIdAndRecruitIdAndType(requesterMemberId, requestDto.getRecruitId(), ApplyType.APPLY);
        if(exists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 지원한 공고입니다.");
        }

        //엔티티 생성 및 저장
        Apply apply = new Apply();
        apply.setType(ApplyType.APPLY);
        apply.setIndividualId(requesterMemberId);
        apply.setRecruitId(requestDto.getRecruitId());
        apply.setMethod(ApplyMethod.valueOf(requestDto.getMethod()));
        apply.setResumeId(requestDto.getResumeId());
        apply.setMessage(requestDto.getMessage());
        apply.setAttachedFileUrl(requestDto.getAttachedFileUrl());
        apply.setStatus(ApplyStatus.PENDING);
        apply.setCreatedAt(LocalDateTime.now());

        return new ApplyResponseDto(applyRepository.save(apply).getId(), "지원이 완료되었습니다.");
    }

    // 사업자 회원이 개인 회원에게 제의하기
    @Transactional
    public ApplyResponseDto offerForIndividual(Long businessProfileId, OfferRequestDto offerRequestDto) {
        // 로그인 체크
        if(businessProfileId == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        BusinessProfile businessProfile = businessProfileRepository.findById(businessProfileId)
                .orElseThrow(EntityNotFoundException::new);
        Long businessMemberId = businessProfile.getMemberId();

        // 공고 존재 확인 및 소유 검증
        Recruit recruit = recruitRepository.findById(offerRequestDto.getRecruitId())
                .orElseThrow(EntityNotFoundException::new);
        if(!Objects.equals(recruit.getBusinessMemberId(), businessMemberId)) {
            new ResponseStatusException(HttpStatus.FORBIDDEN, "본인의 공고만 제의할 수 있습니다.");
        }

        // 공고 상태 검사
        RecruitStatus status = recruit.getStatus();
        if (status == RecruitStatus.CLOSED || status == RecruitStatus.EXPIRED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "마감된 공고입니다.");
        }

        //개인 회원 id 얻고 중복 제의 체크
        IndividualProfile individualProfile = individualProfileRepository.findById(offerRequestDto.getIndividualProfileId())
                .orElseThrow(EntityNotFoundException::new);
        Long individualMemberId = individualProfile.getMemberId();
        boolean exists = applyRepository.existsByIndividualIdAndRecruitIdAndType(
                individualMemberId, offerRequestDto.getRecruitId(), ApplyType.OFFER);
        if(exists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 동일 공고로 제의했습니다.");
        }

        //엔티티 생성 후 저장
        Apply apply = new Apply();
        apply.setType(ApplyType.OFFER);
        apply.setIndividualId(individualMemberId);
        apply.setRecruitId(offerRequestDto.getRecruitId());
        apply.setMessage(offerRequestDto.getMessage());
        apply.setAttachedFileUrl(offerRequestDto.getAttachedFileUrl());
        apply.setStatus(ApplyStatus.PENDING);
        apply.setCreatedAt(LocalDateTime.now());
        apply.setMethod(ApplyMethod.ONLINE);

        return new ApplyResponseDto(applyRepository.save(apply).getId(), "제의가 전달되었습니다.");
    }
}
