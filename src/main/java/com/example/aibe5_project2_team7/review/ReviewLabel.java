package com.example.aibe5_project2_team7.review;

import com.example.aibe5_project2_team7.member.MemberType;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(
        name="review_label",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "unique_review_label_name_targetType",
                        columnNames = {"name", "target_type"})
        }
)

public class ReviewLabel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; //라벨 이름

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private MemberType targetType;
}
