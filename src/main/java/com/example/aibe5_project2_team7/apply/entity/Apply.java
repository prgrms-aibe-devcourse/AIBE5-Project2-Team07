package com.example.aibe5_project2_team7.apply.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "apply")
@Getter
@Setter
@NoArgsConstructor
public class Apply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "individual_id", nullable = false)
    private Long individualId; // ==memberid랑 동일

    @Column(name = "recruit_id", nullable = false)
    private Long recruitId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ApplyStatus status;

    @Column(name = "resume_id")
    private Long resumeId;

    @Column(name = "message", length = 2000)
    private String message;

    @Column(name = "attached_file_url")
    private String attachedFileUrl;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ApplyType type; //제안 or 제의

    @Enumerated(EnumType.STRING)
    @Column(name="method", nullable = false)
    private ApplyMethod method; //온라인 or 이메일


}