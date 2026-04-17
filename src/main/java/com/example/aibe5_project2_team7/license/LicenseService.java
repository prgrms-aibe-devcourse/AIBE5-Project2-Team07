package com.example.aibe5_project2_team7.license;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LicenseService {
    private final LicenseRepository licenseRepository;

    public License create(License l) { return licenseRepository.save(l); }

    public License update(Long id, License l) {
        License ex = licenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        ex.setLicenseName(l.getLicenseName());
        ex.setLicenseNumber(l.getLicenseNumber());
        ex.setAcquisitionDate(l.getAcquisitionDate());
        ex.setIssuedBy(l.getIssuedBy());
        ex.setLicenseFileUrl(l.getLicenseFileUrl());
        return licenseRepository.save(ex);
    }

    public void delete(Long id) { licenseRepository.deleteById(id); }

    public License get(Long id) { return licenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found")); }

    public List<License> listByMember(Long memberId) { return licenseRepository.findByMemberId(memberId); }
}
