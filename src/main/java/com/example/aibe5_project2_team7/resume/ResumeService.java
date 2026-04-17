package com.example.aibe5_project2_team7.resume;

import com.example.aibe5_project2_team7.career.CareerRepository;
import com.example.aibe5_project2_team7.highest_education.HighestEducationRepository;
import com.example.aibe5_project2_team7.individual_profile.DesiredBusinessType;
import com.example.aibe5_project2_team7.individual_profile.DesiredBusinessTypeRepository;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfile;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfileRepository;
import com.example.aibe5_project2_team7.license.LicenseRepository;
import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.repository.MemberRepository;
import com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName;
import com.example.aibe5_project2_team7.resume.dto.ResumeDetailDto;
import com.example.aibe5_project2_team7.resume.dto.ResumeSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    public Page<ResumeSummaryDto> getPublicResumes(int page) {
        Pageable pageable = PageRequest.of(page, 20, org.springframework.data.domain.Sort.by("updatedAt").descending());
        Page<Resume> resumes = resumeRepository.findByVisibilityTrue(pageable);

        List<ResumeSummaryDto> dtos = resumes.stream().map(r -> {
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
            return new ResumeSummaryDto(r.getId(), r.getMemberId(), r.getTitle(), r.getUpdatedAt(), name, avg, desiredTypes);
        }).collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    // 실시간 활동 인재 조회
    public Page<ResumeSummaryDto> getResumesByIndividualActive(int page) {
        Pageable pageable = PageRequest.of(page, 20, org.springframework.data.domain.Sort.by("updatedAt").descending());
        Page<Resume> resumes = resumeRepository.findByVisibilityTrue(pageable);

        List<ResumeSummaryDto> dtos = resumes.stream().filter(r -> {
            IndividualProfile p = individualProfileRepository.findByMemberId(r.getMemberId()).orElse(null);
            return p != null && Boolean.TRUE.equals(p.getIsActive());
        }).map(r -> {
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
            return new ResumeSummaryDto(r.getId(), r.getMemberId(), r.getTitle(), r.getUpdatedAt(), name, avg, desiredTypes);
        }).collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, dtos.size());
    }

    // 스페셜 인재 조회
    public Page<ResumeSummaryDto> getResumesByIndividualSpecial(int page) {
        Pageable pageable = PageRequest.of(page, 20, org.springframework.data.domain.Sort.by("updatedAt").descending());
        Page<Resume> resumes = resumeRepository.findByVisibilityTrue(pageable);

        List<ResumeSummaryDto> dtos = resumes.stream().filter(r -> {
            IndividualProfile p = individualProfileRepository.findByMemberId(r.getMemberId()).orElse(null);
            return p != null && Boolean.TRUE.equals(p.getIsSpecial());
        }).map(r -> {
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
            return new ResumeSummaryDto(r.getId(), r.getMemberId(), r.getTitle(), r.getUpdatedAt(), name, avg, desiredTypes);
        }).collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, dtos.size());
    }

    public Resume createResume(Map<String, Object> payload) {

        Long memberId = Long.valueOf(payload.get("memberId").toString());
        String title = (String) payload.get("title");
        Boolean visibility = payload.get("visibility") != null ? Boolean.valueOf(payload.get("visibility").toString()) : false;
        String content = payload.get("content") != null ? payload.get("content").toString() : null;


        Member m = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found"));
        if (m.getMemberType() == null || !m.getMemberType().name().equals("INDIVIDUAL")) {
            throw new RuntimeException("Only individual members can create resumes");
        }

        Resume r = new Resume();
        r.setMemberId(memberId);
        r.setTitle(title);
        r.setVisibility(visibility);
        r.setContent(content);


        List<Long> careerIds = payload.get("careerIds") instanceof List ? (List<Long>) payload.get("careerIds") : new ArrayList<>();
        List<Long> licenseIds = payload.get("licenseIds") instanceof List ? (List<Long>) payload.get("licenseIds") : new ArrayList<>();
        List<Long> educationIds = payload.get("educationIds") instanceof List ? (List<Long>) payload.get("educationIds") : new ArrayList<>();

        // save resume first to get id
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
            dbt.setMemberId(memberId);
            try {
                dbt.setType(BusinessTypeName.valueOf(t));
                desiredBusinessTypeRepository.save(dbt);
            } catch (IllegalArgumentException ex) {
                // ignore invalid business type names
            }
        }

        return resumeRepository.save(saved);
    }

    // 이력서 상세보기
    public ResumeDetailDto getResumeDetail(Long resumeId) {
        Resume r = resumeRepository.findById(resumeId).orElseThrow(() -> new RuntimeException("Resume not found"));
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


        List<Object> careers = r.getCareers().stream().map(c -> {
            return Map.of(
                    "id", c.getId(),
                    "company", c.getCompany(),
                    "role", c.getRole(),
                    "startDate", c.getStartDate(),
                    "endDate", c.getEndDate()
            );
        }).collect(Collectors.toList());

        List<Object> licenses = r.getLicenses().stream().map(l -> {
            return Map.of(
                    "id", l.getId(),
                    "licenseName", l.getLicenseName(),
                    "licenseNumber", l.getLicenseNumber(),
                    "acquisitionDate", l.getAcquisitionDate(),
                    "issuedBy", l.getIssuedBy(),
                    "licenseFileUrl", l.getLicenseFileUrl()
            );
        }).collect(Collectors.toList());

        List<Object> educations = r.getEducations().stream().map(e -> {
            return Map.of(
                    "id", e.getId(),
                    "schoolName", e.getSchoolName(),
                    "schoolType", e.getSchoolType(),
                    "major", e.getMajor()
            );
        }).collect(Collectors.toList());

        ResumeDetailDto dto = new ResumeDetailDto(
                r.getId(), r.getMemberId(), r.getTitle(), r.getContent(), r.getUpdatedAt(), name, avg, desiredTypes, careers, licenses, educations
        );

        return dto;
    }

    // 업직종별 인재 조회
    public Page<ResumeSummaryDto> getResumesByDesiredBusinessTypes(List<String> types, int page) {
        Pageable pageable = PageRequest.of(page, 20, org.springframework.data.domain.Sort.by("updatedAt").descending());

        if (types == null || types.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        // convert input strings to enum names if necessary; these input strings are expected to match enum names
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

        List<Long> memberIds = memberRepository.findDistinctIdByPreferredRegionsIdIn(regionIds);
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
        return new ResumeSummaryDto(r.getId(), r.getMemberId(), r.getTitle(), r.getUpdatedAt(), name, avg, desiredTypes);
    }
    // 이력서 조회
    public ResumeDetailDto getOwnResume(Long memberId) {
        Resume r = resumeRepository.findByMemberId(memberId).stream().findFirst().orElseThrow(() -> new RuntimeException("Resume not found for member"));
        return getResumeDetail(r.getId());
    }
    // 이력서 수정
    public Resume patchOwnResume(Long memberId, Map<String, Object> payload) {
        Resume r = resumeRepository.findByMemberId(memberId).stream().findFirst().orElseThrow(() -> new RuntimeException("Resume not found for member"));

        // update simple fields
        if (payload.containsKey("title")) {
            r.setTitle(payload.get("title") != null ? payload.get("title").toString() : null);
        }
        if (payload.containsKey("content")) {
            r.setContent(payload.get("content") != null ? payload.get("content").toString() : null);
        }
        if (payload.containsKey("visibility")) {
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

        return resumeRepository.save(r);
    }
    // 이력서 삭제
    public void deleteOwnResume(Long memberId){
        Resume r = resumeRepository.findByMemberId(memberId).stream().findFirst().orElseThrow(() -> new RuntimeException("Resume not found for member"));
        resumeRepository.delete(r);
    }
}
