package com.example.aibe5_project2_team7.apply;

import com.example.aibe5_project2_team7.apply.dto.*;
import com.example.aibe5_project2_team7.apply.entity.*;
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
import com.example.aibe5_project2_team7.resume.ResumeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
    public ApplyResponseDto applyForRecruit(Long requesterMemberId, ApplyRequestDto requestDto) {
        if (requesterMemberId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        Member member = memberRepository.findById(requesterMemberId)
                .orElseThrow(EntityNotFoundException::new);
        if (member.getMemberType() != MemberType.INDIVIDUAL) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "사업자는 지원할 수 없습니다.");
        }

        if (requestDto.getAgree() == null || !requestDto.getAgree()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "약관에 동의해야 합니다.");
        }

        Recruit recruit = recruitRepository.findById(requestDto.getRecruitId())
                .orElseThrow(EntityNotFoundException::new);
        if (recruit.getStatus() == RecruitStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "마감된 공고입니다.");
        }

        resumeRepository.findById(requestDto.getResumeId())
                .orElseThrow(EntityNotFoundException::new);

        boolean exists = applyRepository.existsByIndividualIdAndRecruitIdAndType(
                requesterMemberId, requestDto.getRecruitId(), ApplyType.APPLY);
        if (exists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 지원한 공고입니다.");
        }

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
    public ApplyResponseDto offerForIndividual(Long businessProfileId, OfferRequestDto offerRequestDto) {
        if (businessProfileId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        BusinessProfile businessProfile = businessProfileRepository.findById(businessProfileId)
                .orElseThrow(EntityNotFoundException::new);
        Long businessMemberId = businessProfile.getMemberId();

        Recruit recruit = recruitRepository.findById(offerRequestDto.getRecruitId())
                .orElseThrow(EntityNotFoundException::new);
        if (!Objects.equals(recruit.getBusinessMemberId(), businessMemberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인의 공고만 제의할 수 있습니다.");
        }

        RecruitStatus status = recruit.getStatus();
        if (status == RecruitStatus.CLOSED || status == RecruitStatus.EXPIRED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "마감된 공고입니다.");
        }

        IndividualProfile individualProfile = individualProfileRepository.findById(offerRequestDto.getIndividualProfileId())
                .orElseThrow(EntityNotFoundException::new);
        Long individualMemberId = individualProfile.getMemberId();

        boolean exists = applyRepository.existsByIndividualIdAndRecruitIdAndType(
                individualMemberId, offerRequestDto.getRecruitId(), ApplyType.OFFER);
        if (exists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 동일 공고로 제의했습니다.");
        }

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

    // PENDING 상태 — 지원 현황 / 제의 현황
    // 개인 — 내가 한 지원 목록
    @Transactional(readOnly = true)
    public Page<ApplyDto> getMyApplications(Long memberId, Pageable pageable) {
        return applyRepository.findByIndividualIdAndType(memberId, ApplyType.APPLY, pageable)
                .map(this::toDto);
    }

    // 개인 — 받은 제의 목록
    @Transactional(readOnly = true)
    public Page<ApplyDto> getOffersReceived(Long memberId, Pageable pageable) {
        return applyRepository.findByIndividualIdAndType(memberId, ApplyType.OFFER, pageable)
                .map(this::toDto);
    }

    // 사업자 — 보낸 제의 목록 (recruitId 필터 선택)
    @Transactional(readOnly = true)
    public Page<ApplyDto> getOffersSentByBusiness(Long businessProfileId, Long recruitId, Pageable pageable) {
        List<Long> recruitIds = resolveRecruitIds(businessProfileId, recruitId);
        if (recruitIds.isEmpty()) return Page.empty();
        return applyRepository.findByRecruitIdInAndType(recruitIds, ApplyType.OFFER, pageable)
                .map(this::toDto);
    }

    // 사업자 — 받은 지원 목록 (recruitId 필터 선택)
    @Transactional(readOnly = true)
    public Page<ApplyDto> getApplicationsReceivedByBusiness(Long businessProfileId, Long recruitId, Pageable pageable) {
        List<Long> recruitIds = resolveRecruitIds(businessProfileId, recruitId);
        if (recruitIds.isEmpty()) return Page.empty();
        return applyRepository.findByRecruitIdInAndType(recruitIds, ApplyType.APPLY, pageable)
                .map(this::toDto);
    }

    // 근무 관리 / 리뷰 관리 통합 조회
    // status: ACCEPTED(근무 관리), COMPLETED(리뷰 관리)
    // type: null(전체 탭), APPLY(지원 탭), OFFER(제의 탭)
    // 개인 — 근무 관리 & 리뷰 관리
    @Transactional(readOnly = true)
    public Page<ApplyDto> getAppliesByIndividual(Long memberId, ApplyStatus status, ApplyType type, Pageable pageable) {
        if (type == null) {
            return applyRepository.findByIndividualIdAndStatus(memberId, status, pageable)
                    .map(this::toDto);
        }
        return applyRepository.findByIndividualIdAndStatusAndType(memberId, status, type, pageable)
                .map(this::toDto);
    }

    // 사업자 — 근무 관리 & 리뷰 관리 (recruitId 필터 선택)
    @Transactional(readOnly = true)
    public Page<ApplyDto> getAppliesByBusiness(Long businessProfileId, ApplyStatus status, ApplyType type, Long recruitId, Pageable pageable) {
        List<Long> recruitIds = resolveRecruitIds(businessProfileId, recruitId);
        if (recruitIds.isEmpty()) return Page.empty();

        if (type == null) {
            return applyRepository.findByRecruitIdInAndStatus(recruitIds, status, pageable)
                    .map(this::toDto);
        }
        return applyRepository.findByRecruitIdInAndStatusAndType(recruitIds, status, type, pageable)
                .map(this::toDto);
    }

    // 상태 변경
    // 수락 / 거절 (PENDING → ACCEPTED | REJECTED)
    public void updateApply(Long applyId, boolean accept, Long requesterMemberId, Long businessProfileId) {
        Apply apply = getApplyOrThrow(applyId);

        if (apply.getStatus() != ApplyStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 처리된 신청입니다.");
        }

        if (apply.getType() == ApplyType.APPLY) {
            assertRequesterIsRecruitOwner(apply, businessProfileId);
        } else {
            assertRequesterIsApplyIndividual(apply, requesterMemberId);
        }

        apply.setStatus(accept ? ApplyStatus.ACCEPTED : ApplyStatus.REJECTED);
    }

    // 근무 완료 처리 (ACCEPTED → COMPLETED) — 사업자만
    public void completeApply(Long applyId, Long businessProfileId) {
        Apply apply = getApplyOrThrow(applyId);

        if (apply.getStatus() != ApplyStatus.ACCEPTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수락된 건만 근무완료 처리할 수 있습니다.");
        }

        assertRequesterIsRecruitOwner(apply, businessProfileId);
        apply.setStatus(ApplyStatus.COMPLETED);
    }


    // 취소 (DB 삭제)
    // 지원/제의/근무 취소 — APPLY면 개인, OFFER면 사업자 권한
    public void cancelApply(Long applyId, Long requesterMemberId, Long businessProfileId) {
        Apply apply = getApplyOrThrow(applyId);

        if (apply.getType() == ApplyType.APPLY) {
            assertRequesterIsApplyIndividual(apply, requesterMemberId);
        } else {
            assertRequesterIsRecruitOwner(apply, businessProfileId);
        }

        applyRepository.delete(apply);
    }

    // 헬퍼

    // recruitId가 있으면 해당 공고가 사업자 소유인지 검증 후 단건 리스트 반환
    // recruitId가 없으면 사업자의 전체 공고 id 리스트 반환
    private List<Long> resolveRecruitIds(Long businessProfileId, Long recruitId) {
        List<Long> allRecruitIds = getRecruitIdsForBusinessProfile(businessProfileId);
        if (recruitId == null) return allRecruitIds;
        if (!allRecruitIds.contains(recruitId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "해당 공고에 대한 조회 권한이 없습니다.");
        }
        return List.of(recruitId);
    }

    private ApplyDto toDto(Apply apply) {
        ApplyDto dto = new ApplyDto();
        dto.setId(apply.getId());
        dto.setIndividualId(apply.getIndividualId());
        dto.setRecruitId(apply.getRecruitId());
        dto.setType(apply.getType());
        dto.setStatus(apply.getStatus());
        dto.setMessage(apply.getMessage());
        dto.setAttachedFileUrl(apply.getAttachedFileUrl());
        dto.setCreatedAt(apply.getCreatedAt());
        dto.setResumeId(apply.getResumeId());
        dto.setMethod(apply.getMethod());
        Recruit recruit = recruitRepository.findById(apply.getRecruitId()).orElse(null);
        if (recruit != null) {
            dto.setBusinessMemberId(recruit.getBusinessMemberId());
            dto.setRecruitTitle(recruit.getTitle());

            businessProfileRepository.findByMemberId(recruit.getBusinessMemberId())
                    .ifPresent(bp -> dto.setCompanyName(bp.getCompanyName()));
        }
        Member member = memberRepository.findById(apply.getIndividualId())
                .orElseThrow(EntityNotFoundException::new);
        dto.setIndividualName(member.getName());

        return dto;
    }

    private Apply getApplyOrThrow(Long applyId) {
        return applyRepository.findById(applyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 신청을 찾을 수 없습니다."));
    }

    private Long getBusinessMemberIdByProfileId(Long businessProfileId) {
        BusinessProfile bp = businessProfileRepository.findById(businessProfileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "BusinessProfile을 찾을 수 없습니다."));
        return bp.getMemberId();
    }

    private void assertRequesterIsApplyIndividual(Apply apply, Long requesterMemberId) {
        if (requesterMemberId == null || !Objects.equals(apply.getIndividualId(), requesterMemberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "권한이 없습니다.");
        }
    }

    private void assertRequesterIsRecruitOwner(Apply apply, Long businessProfileId) {
        if (businessProfileId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        Long businessMemberId = getBusinessMemberIdByProfileId(businessProfileId);
        Recruit recruit = recruitRepository.findById(apply.getRecruitId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "공고를 찾을 수 없습니다."));
        if (!Objects.equals(recruit.getBusinessMemberId(), businessMemberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "권한이 없습니다.");
        }
    }

    private List<Long> getRecruitIdsForBusinessProfile(Long businessProfileId) {
        Long businessMemberId = getBusinessMemberIdByProfileId(businessProfileId);
        return recruitRepository.findIdsByBusinessMemberId(businessMemberId);
    }
}