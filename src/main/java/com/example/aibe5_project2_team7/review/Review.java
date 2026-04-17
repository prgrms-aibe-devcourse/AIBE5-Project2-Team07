package com.example.aibe5_project2_team7.review;

import com.example.aibe5_project2_team7.common.BaseEntity;
import com.example.aibe5_project2_team7.member.MemberType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Review extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "apply_id", nullable = false)
    private Long applyId; //리뷰 작성에 필요한 지원or제의
    @Column(name = "writer_id", nullable = false)
    private Long writerId; //작성 회원
    @Column(name = "target_id", nullable = false)
    private Long targetId; //대상 회원

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private MemberType targetType; //대상 회원 유형 (예: 개인회원, 사업자회원)

    @Column(nullable = false)
    private int rating; //별점 0~5점

    private String content; //내용

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "label_id")
    private ReviewLabel label;
}
