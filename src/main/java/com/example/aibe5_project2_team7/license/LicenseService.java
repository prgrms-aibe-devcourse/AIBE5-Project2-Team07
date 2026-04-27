package com.example.aibe5_project2_team7.license;

import com.example.aibe5_project2_team7.resume.Resume;
import com.example.aibe5_project2_team7.resume.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LicenseService {
    private final LicenseRepository licenseRepository;
    private final ResumeRepository resumeRepository;

    @Transactional
    public License create(License l) {
        Resume resume = resumeRepository.findByMemberId(l.getMemberId())
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Resume not found for member"));

        License license = new License();
        license.setMemberId(l.getMemberId());
        license.setLicenseName(l.getLicenseName());
        license.setLicenseNumber(l.getLicenseNumber());
        license.setAcquisitionDate(l.getAcquisitionDate());
        license.setIssuedBy(l.getIssuedBy());
        license.setLicenseFileUrl(l.getLicenseFileUrl());

        license.setResume(resume);

        return licenseRepository.save(license);
    }

    public License update(Long id, License l) {
        License ex = licenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        ex.setLicenseName(l.getLicenseName());
        ex.setLicenseNumber(l.getLicenseNumber());
        ex.setAcquisitionDate(l.getAcquisitionDate());
        ex.setIssuedBy(l.getIssuedBy());
        ex.setLicenseFileUrl(l.getLicenseFileUrl());
        return licenseRepository.save(ex);
    }

    @Transactional
    public void delete(Long id) {
        License license = licenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        Resume resume = resumeRepository.findByLicenses_Id(id)
                .orElseThrow(() -> new RuntimeException("resume not found"));

        resume.getLicenses().remove(license);
        resumeRepository.save(resume);

        licenseRepository.delete(license);
    }

    public License get(Long id) { return licenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found")); }

    public List<License> listByMember(Long memberId) { return licenseRepository.findByMemberId(memberId); }
}
