package com.example.aibe5_project2_team7.highest_education;

import com.example.aibe5_project2_team7.resume.Resume;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter@Setter
public class HighestEducation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "member_id", nullable = false)
    private Long memberId;
    @Column(name = "school_name", nullable = false)
    private String schoolName;
    @Column(name = "school_type", nullable = false)
    private String schoolType; //ex) 대학교, 대학원, 고등학교
    private String major;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private Resume resume;
}
