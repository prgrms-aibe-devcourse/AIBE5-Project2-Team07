package com.example.aibe5_project2_team7.review;

import com.example.aibe5_project2_team7.member.MemberType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "review_label")
@NoArgsConstructor
public class ReviewLabel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column( nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    private ReviewLabel(Review review, String name) {
        this.review = review;
        this.name = name;
    }

    public static ReviewLabel create(Review review, String name) {
        return new ReviewLabel(review, name);
    }
}
