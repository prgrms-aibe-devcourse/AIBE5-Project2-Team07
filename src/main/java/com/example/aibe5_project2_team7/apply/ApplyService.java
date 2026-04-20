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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional // ✅ 클래스 레벨 기본 트랜잭션 (쓰기용)
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
        // 로그인 체크
        if (requesterMemberId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        // 개인 회원 확인
        Member member = memberRepository.findById(requesterMemberId)
                .orElseThrow(EntityNotFoundException::new);
        if (member.getMemberType() != MemberType.INDIVIDUAL) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "사업자는 지원할 수 없습니다.");
        }

        // 약관 동의 체크
        if (requestDto.getAgree() == null || !requestDto.getAgree()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "약관에 동의해야 합니다.");
        }

        // 공고 존재 및 마감 확인
        Recruit recruit = recruitRepository.findById(requestDto.getRecruitId())
                .orElseThrow(EntityNotFoundException::new);
        if (recruit.getStatus() == RecruitStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "마감된 공고입니다.");
        }

        // 이력서 존재 확인
        resumeRepository.findById(requestDto.getResumeId())
                .orElseThrow(EntityNotFoundException::new);

        // 중복 지원 체크
        boolean exists = applyRepository.existsByIndividualIdAndRecruitIdAndType(
                requesterMemberId, requestDto.getRecruitId(), ApplyType.APPLY);
        if (exists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 지원한 공고입니다.");
        }

        // 엔티티 생성 및 저장
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
        // 로그인 체크
        if (businessProfileId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        BusinessProfile businessProfile = businessProfileRepository.findById(businessProfileId)
                .orElseThrow(EntityNotFoundException::new);
        Long businessMemberId = businessProfile.getMemberId();

        // 공고 존재 확인 및 소유 검증
        Recruit recruit = recruitRepository.findById(offerRequestDto.getRecruitId())
                .orElseThrow(EntityNotFoundException::new);
        if (!Objects.equals(recruit.getBusinessMemberId(), businessMemberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인의 공고만 제의할 수 있습니다.");
        }

        // 공고 상태 검사
        RecruitStatus status = recruit.getStatus();
        if (status == RecruitStatus.CLOSED || status == RecruitStatus.EXPIRED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "마감된 공고입니다.");
        }

        // 개인 회원 id 얻고 중복 제의 체크
        IndividualProfile individualProfile = individualProfileRepository.findById(offerRequestDto.getIndividualProfileId())
                .orElseThrow(EntityNotFoundException::new);
        Long individualMemberId = individualProfile.getMemberId();

        boolean exists = applyRepository.existsByIndividualIdAndRecruitIdAndType(
                individualMemberId, offerRequestDto.getRecruitId(), ApplyType.OFFER);
        if (exists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 동일 공고로 제의했습니다.");
        }

        // 엔티티 생성 후 저장
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

    // 지원 or 제의 취소
    public void cancelApply(Long applyId, Long requesterMemberId, Long businessProfileId) {
        Apply apply = getApplyOrThrow(applyId);

        if (apply.getType() == ApplyType.APPLY) {
            // 개인이 자신의 지원을 취소
            assertRequesterIsApplyIndividual(apply, requesterMemberId);
        } else {
            // OFFER인 경우: 사업자(공고 소유자)만 취소 가능
            assertRequesterIsRecruitOwner(apply, businessProfileId);
        }

        applyRepository.delete(apply);
    }

    // 개인회원이 한 지원 목록 (페이징)
    @Transactional(readOnly = true)
    public Page<ApplyDto> getMyApplications(Long memberId, int page, int size) {
        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.max(size, 1),
                Sort.by("createdAt").descending()
        );
        return applyRepository.findByIndividualIdAndType(memberId, ApplyType.APPLY, pageable)
                .map(this::toDto);
    }

    // 개인회원이 받은 제의 목록 (페이징)
    @Transactional(readOnly = true)
    public Page<ApplyDto> getOffersReceived(Long memberId, int page, int size) {
        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.max(size, 1),
                Sort.by("createdAt").descending()
        );
        return applyRepository.findByIndividualIdAndType(memberId, ApplyType.OFFER, pageable)
                .map(this::toDto);
    }

    // 사업자회원이 보낸 제의 목록 (페이징)
    @Transactional(readOnly = true)
    public Page<ApplyDto> getOffersSentByBusiness(Long businessProfileId, int page, int size) {
        List<Long> recruitIds = getRecruitIdsForBusinessProfile(businessProfileId);
        if (recruitIds.isEmpty()) return Page.empty();

        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.max(size, 1),
                Sort.by("createdAt").descending()
        );
        return applyRepository.findByRecruitIdInAndType(recruitIds, ApplyType.OFFER, pageable)
                .map(this::toDto);
    }

    // 사업자 회원이 받은 지원 목록 (페이징)
    @Transactional(readOnly = true)
    public Page<ApplyDto> getApplicationsReceivedByBusiness(Long businessProfileId, Long recruitId, int page, int size) {
        List<Long> recruitIds = getRecruitIdsForBusinessProfile(businessProfileId);
        if (recruitIds.isEmpty()) return Page.empty();

        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.max(size, 1),
                Sort.by("createdAt").descending()
        );

        if (recruitId != null) {
            // 요청한 recruitId가 해당 사업자의 공고인지 확인
            if (!recruitIds.contains(recruitId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "해당 공고에 대한 조회 권한이 없습니다.");
            }
            // DB 레벨에서 APPLY 타입 필터링 + 올바른 페이징
            return applyRepository.findByRecruitIdInAndType(List.of(recruitId), ApplyType.APPLY, pageable)
                    .map(this::toDto);
        }

        return applyRepository.findByRecruitIdInAndType(recruitIds, ApplyType.APPLY, pageable)
                .map(this::toDto);
    }

    // 상태 변경 (수락/거절)
    public void updateApply(Long applyId, boolean accept, Long requesterMemberId, Long businessProfileId) {
        Apply apply = getApplyOrThrow(applyId);

        if (apply.getStatus() != ApplyStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 처리된 신청입니다.");
        }

        if (apply.getType() == ApplyType.APPLY) {
            // 사업자회원이 지원을 수락 or 거절
            assertRequesterIsRecruitOwner(apply, businessProfileId);
        } else {
            // OFFER: 개인이 제의를 수락/거절
            assertRequesterIsApplyIndividual(apply, requesterMemberId);
        }
        apply.setStatus(accept ? ApplyStatus.ACCEPTED : ApplyStatus.REJECTED);
    }

    // ── private 헬퍼 메서드 ───
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
        return dto;
    }

    // applyId로 Apply 가져오고 없으면 NOT_FOUND 예외
    private Apply getApplyOrThrow(Long applyId) {
        return applyRepository.findById(applyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 신청을 찾을 수 없습니다."));
    }

    // businessProfileId로 BusinessProfile 조회 후 memberId 반환
    private Long getBusinessMemberIdByProfileId(Long businessProfileId) {
        BusinessProfile bp = businessProfileRepository.findById(businessProfileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "BusinessProfile을 찾을 수 없습니다."));
        return bp.getMemberId();
    }

    // 요청자가 apply.individualId와 일치하는지 확인
    private void assertRequesterIsApplyIndividual(Apply apply, Long requesterMemberId) {
        if (requesterMemberId == null || !Objects.equals(apply.getIndividualId(), requesterMemberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "권한이 없습니다.");
        }
    }

    // 해당 사업자 프로필이 apply의 recruit 소유자인지 확인
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

    // 사업자 프로필 → 해당 사업자의 모든 recruit id 리스트 반환 (id만 조회)
    private List<Long> getRecruitIdsForBusinessProfile(Long businessProfileId) {
        Long businessMemberId = getBusinessMemberIdByProfileId(businessProfileId);
        return recruitRepository.findIdsByBusinessMemberId(businessMemberId);
    }
}