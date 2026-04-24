package com.example.aibe5_project2_team7.resume;

import com.example.aibe5_project2_team7.common.BaseEntity;
import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.career.Career;
import com.example.aibe5_project2_team7.license.License;
import com.example.aibe5_project2_team7.highest_education.HighestEducation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "resume",
        uniqueConstraints = {
                @UniqueConstraint(name = "unique_member_resume", columnNames = "member_id")
        }
)
@Getter@Setter
public class Resume extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "member_id", nullable = false)
    private Long memberId;
    @Column(nullable = false)
    private String title;
    private Boolean visibility; // 이력서 공개 여부
    private String content; // 이력서 내용

    // member_id로 조인할 읽기전용 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", insertable = false, updatable = false)
    private Member member;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Career> careers = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<License> licenses = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HighestEducation> educations = new ArrayList<>();
}
