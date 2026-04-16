package com.example.aibe5_project2_team7.resume;

import com.example.aibe5_project2_team7.career.CareerRepository;
import com.example.aibe5_project2_team7.license.LicenseRepository;
import com.example.aibe5_project2_team7.highest_education.HighestEducationRepository;
import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.repository.MemberRepository;
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

    public Page<ResumeSummaryDto> getPublicResumes(int page) {
        Pageable pageable = PageRequest.of(page, 20, org.springframework.data.domain.Sort.by("updatedAt").descending());
        Page<Resume> resumes = resumeRepository.findByVisibilityTrue(pageable);

        List<ResumeSummaryDto> dtos = resumes.stream().map(r -> {
            Member m = r.getMember();
            if (m == null) {
                m = memberRepository.findById(r.getMember_id()).orElse(null);
            }
            String name = m != null ? m.getName() : null;
            Double avg = null;
            if (m != null) {
                if (m.getRatingCount() != null && m.getRatingCount() > 0) {
                    avg = m.getRatingSum() / (double) m.getRatingCount();
                } else {
                    avg = 0.0;
                }
            }
            return new ResumeSummaryDto(r.getId(), r.getMember_id(), r.getTitle(), r.getUpdatedAt(), name, avg);
        }).collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, resumes.getTotalElements());
    }

    public Resume createResume(Map<String, Object> payload) {
        // payload must contain memberId, title, visibility, optionally careerIds, licenseIds, educationIds
        Long memberId = Long.valueOf(payload.get("memberId").toString());
        String title = (String) payload.get("title");
        Boolean visibility = payload.get("visibility") != null ? Boolean.valueOf(payload.get("visibility").toString()) : false;
        String content = payload.get("content") != null ? payload.get("content").toString() : null;

        // ensure member exists and is INDIVIDUAL
        Member m = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found"));
        if (m.getMemberType() == null || !m.getMemberType().name().equals("INDIVIDUAL")) {
            throw new RuntimeException("Only individual members can create resumes");
        }

        Resume r = new Resume();
        r.setMember_id(memberId);
        r.setTitle(title);
        r.setVisibility(visibility);
        r.setContent(content);

        // link existing careers/licenses/educations if provided
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

        return resumeRepository.save(saved);
    }
}
