package com.example.aibe5_project2_team7.review;

import com.example.aibe5_project2_team7.member.MemberType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTargetType(MemberType targetType);
    List<Review> findByTargetIdAndTargetType(Long targetId, MemberType targetType);
    List<Review> findTop3ByTargetIdAndTargetTypeOrderByCreatedAtDesc(Long targetId, MemberType targetType);
    boolean existsByApplyId(Long applyId);

    @EntityGraph(attributePaths = {"labels"})
    Optional<Review> findWithLabelsById(Long id);

    @EntityGraph(attributePaths = {"labels"})
    List<Review> findAllByTargetId(Long targetId);

    @EntityGraph(attributePaths = {"labels"})
    List<Review> findAllByWriterId(Long writerId);

    List<Review> findAllByTargetIdAndTargetTypeOrderByCreatedAtDesc(Long targetId, ReviewTargetType targetType);

    boolean existsByApplyIdAndWriterId(Long applyId, Long writerId);
}
