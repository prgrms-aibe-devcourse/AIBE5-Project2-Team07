package com.example.aibe5_project2_team7.review;

import com.example.aibe5_project2_team7.common.BaseEntity;
import com.example.aibe5_project2_team7.member.MemberType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "review",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_review_apply_writer", columnNames = {"apply_id", "writer_id"})
        }
)
@Getter @Setter
@NoArgsConstructor
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
    private ReviewTargetType targetType; //대상 회원 유형 (예: 개인회원, 사업자회원)

    @Column(nullable = false)
    private int rating; //별점 0~5점

    private String content; //내용

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewLabel> labels = new ArrayList<>();

    @Column(name = "written_at", nullable = false)
    private LocalDateTime writtenAt;

    private Review(
            Long writerId,
            Long targetId,
            ReviewTargetType targetType,
            Long applyId,
            Integer rating,
            String content
    ) {
        this.writerId = writerId;
        this.targetId = targetId;
        this.targetType = targetType;
        this.applyId = applyId;
        this.rating = rating;
        this.content = content;
        this.writtenAt = LocalDateTime.now();
    }

    public static Review create(
            Long writerId,
            Long targetId,
            ReviewTargetType targetType,
            Long applyId,
            Integer rating,
            String content,
            List<String> labelNames
    ) {
        Review review = new Review(writerId, targetId, targetType, applyId, rating, content);

        if (labelNames != null) {
            for (String labelName : labelNames) {
                review.addLabel(labelName);
            }
        }

        return review;
    }

    public void update(
            Integer rating,
            String content,
            List<String> labelNames
    ) {
        this.rating = rating;
        this.content = content;

        this.labels.clear();

        if (labelNames != null) {
            for (String labelName : labelNames) {
                addLabel(labelName);
            }
        }
    }

    private void addLabel(String labelName) {
        ReviewLabel label = ReviewLabel.create(this, labelName);
        this.labels.add(label);
    }
}
