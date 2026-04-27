package com.example.aibe5_project2_team7.license;

import com.example.aibe5_project2_team7.resume.Resume;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter@Setter
public class License {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "member_id", nullable = false)
    private Long memberId;
    @Column(name = "license_name", nullable = false)
    private String licenseName;
    @Column(name = "license_number", nullable = false)
    private String licenseNumber;
    @Column(name = "acquisition_date", nullable = false)
    private LocalDate acquisitionDate;
    @Column(name = "issued_by")
    private String issuedBy;
    @Column(name = "license_file_url")
    private String licenseFileUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private Resume resume;
}
