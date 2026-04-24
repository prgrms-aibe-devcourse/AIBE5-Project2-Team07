package com.example.aibe5_project2_team7.resume;

import com.example.aibe5_project2_team7.business_profile.BusinessProfile;
import com.example.aibe5_project2_team7.business_profile.BusinessProfileRepository;
import com.example.aibe5_project2_team7.career.CareerRepository;
import com.example.aibe5_project2_team7.highest_education.HighestEducationRepository;
import com.example.aibe5_project2_team7.individual_profile.DesiredBusinessType;
import com.example.aibe5_project2_team7.individual_profile.DesiredBusinessTypeRepository;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfile;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfileRepository;
import com.example.aibe5_project2_team7.license.LicenseRepository;
import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.MemberType;
import com.example.aibe5_project2_team7.member.repository.MemberRepository;
import com.example.aibe5_project2_team7.member_address.MemberAddress;
import com.example.aibe5_project2_team7.member_address.MemberAddressRepository;
import com.example.aibe5_project2_team7.member_preferred_region.MemberPreferredRegion;
import com.example.aibe5_project2_team7.member_preferred_region.MemberPreferredRegionRepository;
import com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName;
import com.example.aibe5_project2_team7.region.Region;
import com.example.aibe5_project2_team7.region.RegionRepository;
import com.example.aibe5_project2_team7.region.RegionResponseDto;
import com.example.aibe5_project2_team7.resume.dto.ResumeDetailDto;
import com.example.aibe5_project2_team7.resume.dto.ResumeSummaryDto;
import com.example.aibe5_project2_team7.review.Review;
import com.example.aibe5_project2_team7.review.ReviewRepository;
import com.example.aibe5_project2_team7.review.ReviewTargetType;
import com.example.aibe5_project2_team7.review.dto.ReviewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final MemberRepository memberRepository;
    private final CareerRepository careerRepository;
    private final LicenseRepository licenseRepository;
    private final HighestEducationRepository highestEducationRepository;
    private final DesiredBusinessTypeRepository desiredBusinessTypeRepository;
    private final IndividualProfileRepository individualProfileRepository;
    private final MemberPreferredRegionRepository memberPreferredRegionRepository;
    private final ReviewRepository reviewRepository;
    private final MemberAddressRepository memberAddressRepository;
    private final RegionRepository regionRepository;
    private final BusinessProfileRepository businessProfileRepository;


    public Page<ResumeSummaryDto> getPublicResumes(int page) {
        Pageable pageable = PageRequest.of(page, 20, org.springframework.data.domain.Sort.by("updatedAt").descending());
        Page<Resume> resumes = resumeRepository.findByVisibilityTrue(pageable);

        List<ResumeSummaryDto> dtos = resumes.stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    // 실시간 활동 인재 조회
    public Page<ResumeSummaryDto> getResumesByIndividualActive(int page) {
        Pageable pageable = PageRequest.of(
                page,
                20,
                org.springframework.data.domain.Sort.by("updatedAt").descending()
        );

        List<Long> activeMemberIds = individualProfileRepository.findByIsActiveTrue()
                .stream()
                .map(IndividualProfile::getMemberId)
                .collect(Collectors.toList());

        if (activeMemberIds.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }

        Page<Resume> resumes = resumeRepository.findByVisibilityTrueAndMemberIdIn(activeMemberIds, pageable);

        List<ResumeSummaryDto> dtos = resumes.stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    // 스페셜 인재 조회
    public Page<ResumeSummaryDto> getResumesByIndividualSpecial(int page) {
        Pageable pageable = PageRequest.of(
                page,
                20,
                org.springframework.data.domain.Sort.by("updatedAt").descending()
        );

        List<Long> specialMemberIds = individualProfileRepository.findByIsSpecialTrue()
                .stream()
                .map(IndividualProfile::getMemberId)
                .collect(Collectors.toList());

        if (specialMemberIds.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }

        Page<Resume> resumes = resumeRepository.findByVisibilityTrueAndMemberIdIn(specialMemberIds, pageable);

        List<ResumeSummaryDto> dtos = resumes.stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    @Transactional
    public Resume createResume(Long id, Map<String, Object> payload) {
        if (resumeRepository.findByMemberId(id).isPresent()) {
            throw new RuntimeException("이미 이력서가 존재합니다");
        }

        String title = (String) payload.get("title");
        Boolean visibility = payload.get("visibility") != null ? Boolean.valueOf(payload.get("visibility").toString()) : false;
        String content = payload.get("content") != null ? payload.get("content").toString() : null;


        Member m = memberRepository.findById(id).orElseThrow(() -> new RuntimeException("Member not found"));
        if (m.getMemberType() == null || !m.getMemberType().name().equals("INDIVIDUAL")) {
            throw new RuntimeException("Only individual members can create resumes");
        }

        Resume r = new Resume();
        r.setMemberId(id);
        r.setTitle(title);
        r.setVisibility(visibility);
        r.setContent(content);


        List<Long> careerIds = payload.get("careerIds") instanceof List ? (List<Long>) payload.get("careerIds") : new ArrayList<>();
        List<Long> licenseIds = payload.get("licenseIds") instanceof List ? (List<Long>) payload.get("licenseIds") : new ArrayList<>();
        List<Long> educationIds = payload.get("educationIds") instanceof List ? (List<Long>) payload.get("educationIds") : new ArrayList<>();


        Resume saved = resumeRepository.save(r);

        if (!careerIds.isEmpty()) {
            List found = careerRepository.findAllById(careerIds);
            saved.getCareers().addAll(found);
        }
        if (!licenseIds.isEmpty()) {
            List found = licenseRepository.findAllById(licenseIds);
            saved.getLicenses().addAll(found);
        }
        if (!educationIds.isEmpty()) {
            List found = highestEducationRepository.findAllById(educationIds);
            saved.getEducations().addAll(found);
        }


        List<String> desiredTypes = payload.get("desiredBusinessTypes") instanceof List ? (List<String>) payload.get("desiredBusinessTypes") : new ArrayList<>();
        for (String t : desiredTypes) {
            DesiredBusinessType dbt = new DesiredBusinessType();
            dbt.setMemberId(id);
            try {
                dbt.setType(BusinessTypeName.valueOf(t));
                desiredBusinessTypeRepository.save(dbt);
            } catch (IllegalArgumentException ex) {

            }
        }

        // preferred region 저장: payload key는 preferredRegionIds 로 기대 (List<Integer> 혹은 List<Number>)
        if (payload.containsKey("preferredRegionIds")) {
            Object raw = payload.get("preferredRegionIds");
            if (raw instanceof List) {
                List<?> rawList = (List<?>) raw;
                // 기존에 같은 member의 매핑이 있을 경우 대비하여 삭제
                List<MemberPreferredRegion> existing = memberPreferredRegionRepository.findByMemberId(id);
                if (!existing.isEmpty()) {
                    memberPreferredRegionRepository.deleteAll(existing);
                }

                List<MemberPreferredRegion> toSave = new ArrayList<>();
                for (Object o : rawList) {
                    if (o == null) continue;
                    try {
                        Integer regionId = o instanceof Number ? ((Number) o).intValue() : Integer.valueOf(o.toString());
                        Optional<Region> regionOpt = regionRepository.findById(regionId);
                        if (regionOpt.isPresent()) {
                            MemberPreferredRegion mpr = new MemberPreferredRegion();
                            // set member reference - load managed member entity
                            mpr.setMember(m);
                            mpr.setRegion(regionOpt.get());
                            toSave.add(mpr);
                        }
                    } catch (NumberFormatException ignored) {
                    }
                }
                if (!toSave.isEmpty()) {
                    memberPreferredRegionRepository.saveAll(toSave);
                }
            }
        }

        return resumeRepository.save(saved);
    }

    public ResumeDetailDto getResumeDetail(Long resumeId) {
        Resume r = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        Member m = r.getMember();
        if (m == null) {
            m = memberRepository.findById(r.getMemberId()).orElse(null);
        }

        String memberName = null;
        Double ratingAverage = 0.0;
        LocalDate birthDate = null;
        String gender = null;
        String address = null;
        String phone = "비공개";
        String email = null;
        String profileImageUrl = null;

        List<String> desiredTypes = new ArrayList<>();
        List<ReviewResponse> reviews = new ArrayList<>();

        Boolean isActive = false;

        if (m != null) {
            memberName = m.getName();

            if (m.getRatingCount() != null && m.getRatingCount() > 0) {
                ratingAverage = m.getRatingSum() / (double) m.getRatingCount();
            }

            birthDate = m.getBirthDate();
            gender = m.getGender() != null ? m.getGender().toString() : null;
            email = m.getEmail();
            profileImageUrl = m.getImage();

            IndividualProfile profile = individualProfileRepository.findByMemberId(m.getId())
                    .orElse(null);

            isActive = profile != null && Boolean.TRUE.equals(profile.getIsActive());

            phone = resolvePhone(m);

            MemberAddress memberAddress = memberAddressRepository.findByMemberId(m.getId())
                    .orElse(null);
            address = buildAddress(memberAddress);

            List<DesiredBusinessType> dts = desiredBusinessTypeRepository.findByMemberId(m.getId());
            desiredTypes = dts.stream()
                    .map(d -> d.getType().name())
                    .collect(Collectors.toList());

            List<Review> reviewEntities =
                    reviewRepository.findAllByTargetIdAndTargetTypeOrderByCreatedAtDesc(
                            m.getId(),
                            ReviewTargetType.INDIVIDUAL
                    );

            reviews = reviewEntities.stream()
                    .map(this::toReviewResponse)
                    .collect(Collectors.toList());
        }

        List<Object> careers = r.getCareers().stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("company", c.getCompany());
            map.put("role", c.getRole());
            map.put("startDate", c.getStartDate());
            map.put("endDate", c.getEndDate());
            return map;
        }).collect(Collectors.toList());

        List<Object> licenses = r.getLicenses().stream().map(l -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", l.getId());
            map.put("licenseName", l.getLicenseName());
            map.put("licenseNumber", l.getLicenseNumber());
            map.put("acquisitionDate", l.getAcquisitionDate());
            map.put("issuedBy", l.getIssuedBy());
            map.put("licenseFileUrl", l.getLicenseFileUrl());
            return map;
        }).collect(Collectors.toList());

        List<Object> educations = r.getEducations().stream().map(e -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", e.getId());
            map.put("schoolName", e.getSchoolName());
            map.put("schoolType", e.getSchoolType());
            map.put("major", e.getMajor());
            return map;
        }).collect(Collectors.toList());

        List<RegionResponseDto> preferredRegions = getPreferredRegions(r.getMemberId());

        return new ResumeDetailDto(
                r.getId(),
                r.getMemberId(),
                r.getTitle(),
                r.getContent(),
                r.getUpdatedAt(),
                memberName,
                ratingAverage,
                birthDate,
                gender,
                address,
                phone,
                email,
                profileImageUrl,
                desiredTypes,
                careers,
                licenses,
                educations,
                preferredRegions,
                reviews,
                isActive
        );
    }
    // 업직종별 인재 조회
    public Page<ResumeSummaryDto> getResumesByDesiredBusinessTypes(List<String> types, int page) {
        Pageable pageable = PageRequest.of(page, 20, org.springframework.data.domain.Sort.by("updatedAt").descending());

        if (types == null || types.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }


        List<String> normalized = types.stream().map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());

        List<Long> memberIds = desiredBusinessTypeRepository.findDistinctMemberIdByTypeIn(normalized);
        if (memberIds == null || memberIds.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        Page<Resume> resumes = resumeRepository.findPublicByMemberIds(memberIds, pageable);
        List<ResumeSummaryDto> dtos = resumes.stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    public Page<ResumeSummaryDto> getResumesByPreferredRegions(List<Long> regionIds, int page) {
        Pageable pageable = PageRequest.of(page, 20, org.springframework.data.domain.Sort.by("updatedAt").descending());

        if (regionIds == null || regionIds.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        List<Long> memberIds = memberPreferredRegionRepository.findMemberIdsByRegionIds(regionIds);
        if (memberIds == null || memberIds.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        Page<Resume> resumes = resumeRepository.findPublicByMemberIds(memberIds, pageable);
        List<ResumeSummaryDto> dtos = resumes.stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    public Page<ResumeSummaryDto> getResumesByBrandIds(List<Long> brandIds, int page) {
        if (brandIds == null || brandIds.isEmpty()) {
            return new PageImpl<>(new ArrayList<>(), PageRequest.of(page,20), 0);
        }
        List<Long> memberIds = careerRepository.findDistinctMemberIdByBrandIdIn(brandIds);
        if (memberIds == null || memberIds.isEmpty()) {
            return new PageImpl<>(new ArrayList<>(), PageRequest.of(page,20), 0);
        }
        Pageable pageable = PageRequest.of(page, 20, org.springframework.data.domain.Sort.by("updatedAt").descending());
        Page<Resume> resumes = resumeRepository.findPublicByMemberIds(memberIds, pageable);

        List<ResumeSummaryDto> dtos = resumes.stream().map(r -> mapToSummary(r)).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    // 별점 높은 순
    public Page<ResumeSummaryDto> getPublicResumesByRating(int page) {
        Pageable pageable = PageRequest.of(page, 20);
        Page<Resume> resumes = resumeRepository.findPublicResumesOrderByRating(pageable);
        List<ResumeSummaryDto> dtos = resumes.stream().map(this::mapToSummary).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    // 경력 많은 순
    public Page<ResumeSummaryDto> getResumesByCareerCount(int page) {
        Pageable pageable = PageRequest.of(page, 20);
        Page<Resume> resumes = resumeRepository.findPublicResumesOrderByCareerCount(pageable);
        List<ResumeSummaryDto> dtos = resumes.stream().map(this::mapToSummary).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    // active + rating
    public Page<ResumeSummaryDto> getActiveResumesByRating(int page) {
        List<Long> activeMemberIds = individualProfileRepository.findByIsActiveTrue()
                .stream()
                .map(IndividualProfile::getMemberId)
                .collect(Collectors.toList());
        if (activeMemberIds.isEmpty()) return new PageImpl<>(List.of(), PageRequest.of(page,20), 0);
        Pageable pageable = PageRequest.of(page, 20);
        Page<Resume> resumes = resumeRepository.findPublicByMemberIdsOrderByRating(activeMemberIds, pageable);
        List<ResumeSummaryDto> dtos = resumes.stream().map(this::mapToSummary).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    // active + careers
    public Page<ResumeSummaryDto> getActiveResumesByCareerCount(int page) {
        List<Long> activeMemberIds = individualProfileRepository.findByIsActiveTrue()
                .stream()
                .map(IndividualProfile::getMemberId)
                .collect(Collectors.toList());
        if (activeMemberIds.isEmpty()) return new PageImpl<>(List.of(), PageRequest.of(page,20), 0);
        Pageable pageable = PageRequest.of(page, 20);
        Page<Resume> resumes = resumeRepository.findPublicByMemberIdsOrderByCareerCount(activeMemberIds, pageable);
        List<ResumeSummaryDto> dtos = resumes.stream().map(this::mapToSummary).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    // special + rating
    public Page<ResumeSummaryDto> getSpecialResumesByRating(int page) {
        List<Long> specialIds = individualProfileRepository.findByIsSpecialTrue()
                .stream()
                .map(IndividualProfile::getMemberId)
                .collect(Collectors.toList());
        if (specialIds.isEmpty()) return new PageImpl<>(List.of(), PageRequest.of(page,20), 0);
        Pageable pageable = PageRequest.of(page, 20);
        Page<Resume> resumes = resumeRepository.findPublicByMemberIdsOrderByRating(specialIds, pageable);
        List<ResumeSummaryDto> dtos = resumes.stream().map(this::mapToSummary).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    // special + careers
    public Page<ResumeSummaryDto> getSpecialResumesByCareerCount(int page) {
        List<Long> specialIds = individualProfileRepository.findByIsSpecialTrue()
                .stream()
                .map(IndividualProfile::getMemberId)
                .collect(Collectors.toList());
        if (specialIds.isEmpty()) return new PageImpl<>(List.of(), PageRequest.of(page,20), 0);
        Pageable pageable = PageRequest.of(page, 20);
        Page<Resume> resumes = resumeRepository.findPublicByMemberIdsOrderByCareerCount(specialIds, pageable);
        List<ResumeSummaryDto> dtos = resumes.stream().map(this::mapToSummary).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    // brands + rating
    public Page<ResumeSummaryDto> getResumesByBrandIdsOrderByRating(List<Long> brandIds, int page) {
        if (brandIds == null || brandIds.isEmpty()) return new PageImpl<>(List.of(), PageRequest.of(page,20), 0);
        List<Long> memberIds = careerRepository.findDistinctMemberIdByBrandIdIn(brandIds);
        if (memberIds == null || memberIds.isEmpty()) return new PageImpl<>(List.of(), PageRequest.of(page,20), 0);
        Pageable pageable = PageRequest.of(page, 20);
        Page<Resume> resumes = resumeRepository.findPublicByMemberIdsOrderByRating(memberIds, pageable);
        List<ResumeSummaryDto> dtos = resumes.stream().map(this::mapToSummary).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    // brands + careers
    public Page<ResumeSummaryDto> getResumesByBrandIdsOrderByCareerCount(List<Long> brandIds, int page) {
        if (brandIds == null || brandIds.isEmpty()) return new PageImpl<>(List.of(), PageRequest.of(page,20), 0);
        List<Long> memberIds = careerRepository.findDistinctMemberIdByBrandIdIn(brandIds);
        if (memberIds == null || memberIds.isEmpty()) return new PageImpl<>(List.of(), PageRequest.of(page,20), 0);
        Pageable pageable = PageRequest.of(page, 20);
        Page<Resume> resumes = resumeRepository.findPublicByMemberIdsOrderByCareerCount(memberIds, pageable);
        List<ResumeSummaryDto> dtos = resumes.stream().map(this::mapToSummary).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    private ResumeSummaryDto mapToSummary(Resume r) {
        Member m = r.getMember();
        if (m == null) {
            m = memberRepository.findById(r.getMemberId()).orElse(null);
        }
        String name = m != null ? m.getName() : null;
        Double avg = null;
        List<String> desiredTypes = new ArrayList<>();
        if (m != null) {
            if (m.getRatingCount() != null && m.getRatingCount() > 0) {
                avg = m.getRatingSum() / (double) m.getRatingCount();
            } else {
                avg = 0.0;
            }
            List<DesiredBusinessType> dts = desiredBusinessTypeRepository.findByMemberId(m.getId());
            desiredTypes = dts.stream().map(d -> d.getType().name()).collect(Collectors.toList());
        }
        List<RegionResponseDto> preferredRegions = getPreferredRegions(r.getMemberId());
        return new ResumeSummaryDto(r.getId(), r.getMemberId(), r.getTitle(), r.getUpdatedAt(), name, avg, desiredTypes,preferredRegions);
    }
    // 이력서 조회
    public ResumeDetailDto getOwnResume(Long memberId) {
        Resume r = resumeRepository.findByMemberId(memberId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        return getResumeDetail(r.getId());
    }
    // 이력서 수정
    @Transactional
    public Resume patchOwnResume(Long memberId, Map<String, Object> payload) {
        Resume r = resumeRepository.findByMemberId(memberId).stream().findFirst().orElseThrow(() -> new RuntimeException("Resume not found for member"));

        // update simple fields
        if (payload.containsKey("title")) {
            r.setTitle(payload.get("title") != null ? payload.get("title").toString() : null);
        }
        if (payload.containsKey("content")) {
            r.setContent(payload.get("content") != null ? payload.get("content").toString() : null);
        }
        if (payload.containsKey("visibility") && payload.get("visibility") != null) {
            r.setVisibility(Boolean.valueOf(payload.get("visibility").toString()));
        }


        if (payload.containsKey("careerIds")) {
            List<Long> careerIds = payload.get("careerIds") instanceof List ? (List<Long>) payload.get("careerIds") : new ArrayList<>();
            r.getCareers().clear();
            if (!careerIds.isEmpty()) {
                List found = careerRepository.findAllById(careerIds);
                r.getCareers().addAll(found);
            }
        }
        if (payload.containsKey("licenseIds")) {
            List<Long> licenseIds = payload.get("licenseIds") instanceof List ? (List<Long>) payload.get("licenseIds") : new ArrayList<>();
            r.getLicenses().clear();
            if (!licenseIds.isEmpty()) {
                List found = licenseRepository.findAllById(licenseIds);
                r.getLicenses().addAll(found);
            }
        }
        if (payload.containsKey("educationIds")) {
            List<Long> educationIds = payload.get("educationIds") instanceof List ? (List<Long>) payload.get("educationIds") : new ArrayList<>();
            r.getEducations().clear();
            if (!educationIds.isEmpty()) {
                List found = highestEducationRepository.findAllById(educationIds);
                r.getEducations().addAll(found);
            }
        }


        if (payload.containsKey("isPhonePublic")) {
            Boolean flag = payload.get("isPhonePublic") != null ? Boolean.valueOf(payload.get("isPhonePublic").toString()) : false;
            IndividualProfile p = individualProfileRepository.findByMemberId(memberId).orElse(null);
            if (p != null) {
                p.setIsPhonePublic(flag);
                individualProfileRepository.save(p);
            }
        }

        if (payload.containsKey("desiredBusinessTypes")) {
            desiredBusinessTypeRepository.deleteByMemberId(memberId);

            List<String> desiredTypes = payload.get("desiredBusinessTypes") instanceof List
                    ? (List<String>) payload.get("desiredBusinessTypes")
                    : new ArrayList<>();

            for (String t : desiredTypes) {
                DesiredBusinessType dbt = new DesiredBusinessType();
                dbt.setMemberId(memberId);
                dbt.setType(BusinessTypeName.valueOf(t));
                desiredBusinessTypeRepository.save(dbt);
            }
        }

        // preferredRegionIds 처리: 기존 매핑 삭제 후 재저장
        if (payload.containsKey("preferredRegionIds")) {
            Object raw = payload.get("preferredRegionIds");
            // 먼저 기존 매핑 삭제
            List<MemberPreferredRegion> existing = memberPreferredRegionRepository.findByMemberId(memberId);
            if (!existing.isEmpty()) {
                memberPreferredRegionRepository.deleteAll(existing);
            }
            if (raw instanceof List) {
                List<?> rawList = (List<?>) raw;
                List<MemberPreferredRegion> toSave = new ArrayList<>();
                Member member = memberRepository.findById(memberId).orElse(null);
                for (Object o : rawList) {
                    if (o == null) continue;
                    try {
                        Integer regionId = o instanceof Number ? ((Number) o).intValue() : Integer.valueOf(o.toString());
                        Optional<Region> regionOpt = regionRepository.findById(regionId);
                        if (regionOpt.isPresent() && member != null) {
                            MemberPreferredRegion mpr = new MemberPreferredRegion();
                            mpr.setMember(member);
                            mpr.setRegion(regionOpt.get());
                            toSave.add(mpr);
                        }
                    } catch (NumberFormatException ignored) {
                    }
                }
                if (!toSave.isEmpty()) memberPreferredRegionRepository.saveAll(toSave);
            }
        }

        return resumeRepository.save(r);
    }
    // 이력서 삭제
    @Transactional
    public void deleteOwnResume(Long memberId){
        Resume r = resumeRepository.findByMemberId(memberId).stream().findFirst().orElseThrow(() -> new RuntimeException("Resume not found for member"));
        resumeRepository.delete(r);
    }

    // 스크랩한 회원들의 공개 이력서 목록 페이징 조회
    public Page<ResumeSummaryDto> getResumesByMemberIds(List<Long> memberIds, int page, int size) {
        if (memberIds == null || memberIds.isEmpty()) {
            Pageable emptyPageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by("updatedAt").descending());
            return new PageImpl<>(List.of(), emptyPageable, 0);
        }
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), org.springframework.data.domain.Sort.by("updatedAt").descending());
        Page<Resume> resumes = resumeRepository.findPublicByMemberIds(memberIds, pageable);
        List<ResumeSummaryDto> dtos = resumes.stream().map(this::mapToSummary).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    // 선호지역 조회 메서드
    private List<RegionResponseDto> getPreferredRegions(Long memberId) {
        return memberPreferredRegionRepository.findByMemberId(memberId)
                .stream()
                .map(mpr -> RegionResponseDto.from(mpr.getRegion()))
                .toList();
    }

    // 주소 정보 조합 메서드
    private String buildAddress(MemberAddress memberAddress) {
        if (memberAddress == null) return null;

        Region region = memberAddress.getRegion();

        StringBuilder sb = new StringBuilder();

        if (region != null) {
            if (region.getSido() != null && !region.getSido().isBlank()) {
                sb.append(region.getSido());
            }
            if (region.getSigungu() != null && !region.getSigungu().isBlank()) {
                if (sb.length() > 0) sb.append(" ");
                sb.append(region.getSigungu());
            }
        }

        if (memberAddress.getDetailAddress() != null && !memberAddress.getDetailAddress().isBlank()) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(memberAddress.getDetailAddress());
        }

        return sb.length() > 0 ? sb.toString() : null;
    }
    // 전화번호 공개 여부 확인 메서드
    private String resolvePhone(Member member) {
        if (member == null) return "비공개";

        String phone = member.getPhone();
        if (phone == null || phone.isBlank()) {
            return "비공개";
        }

        IndividualProfile profile = individualProfileRepository.findByMemberId(member.getId())
                .orElse(null);

        if (profile == null) {
            return "비공개";
        }

        if (Boolean.TRUE.equals(profile.getIsPhonePublic())) {
            return phone;
        }

        return "비공개";
    }

    private ReviewResponse toReviewResponse(Review review) {
        Member writer = memberRepository.findById(review.getWriterId())
                .orElse(null);

        String writerName = writer != null ? writer.getName() : "작성자";
        String companyName = null;

        if (writer != null && writer.getMemberType() == MemberType.BUSINESS) {
            companyName = businessProfileRepository.findByMemberId(writer.getId())
                    .map(BusinessProfile::getCompanyName)
                    .orElse(writerName);
        }

        return ReviewResponse.from(review, writerName, companyName);
    }
}
