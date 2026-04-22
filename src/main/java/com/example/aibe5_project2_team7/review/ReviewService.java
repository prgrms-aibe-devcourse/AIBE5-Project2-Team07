package com.example.aibe5_project2_team7.review;

import com.example.aibe5_project2_team7.apply.entity.Apply;
import com.example.aibe5_project2_team7.apply.ApplyRepository;
import com.example.aibe5_project2_team7.apply.entity.ApplyStatus;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfile;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfileRepository;
import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.repository.MemberRepository;
import com.example.aibe5_project2_team7.recruit.RecruitRepository;
import com.example.aibe5_project2_team7.recruit.entity.Recruit;
import com.example.aibe5_project2_team7.review.dto.ReviewCreateRequest;
import com.example.aibe5_project2_team7.review.dto.ReviewResponse;
import com.example.aibe5_project2_team7.review.dto.ReviewUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ApplyRepository applyRepository;
    private final RecruitRepository recruitRepository;
    private final MemberRepository memberRepository;
    private final IndividualProfileRepository individualProfileRepository;

    @Transactional
    public ReviewResponse createReview(Long userId, ReviewCreateRequest request) {

        if (reviewRepository.existsByApplyId(request.getApplyId())) {
            throw new ReviewException("해당 지원 건에는 이미 리뷰가 작성되었습니다.");
        }

        Apply apply = applyRepository.findById(request.getApplyId())
                .orElseThrow(() -> new ReviewException("지원 내역이 존재하지 않습니다."));


        validateWriterAndTarget(
                userId,
                apply,
                request.getTargetType(),
                request.getTargetId()
        );

        validateCreatableReview(
                apply,
                request.getRating(),
                request.getLabelNames()
        );

        List<String> labels = request.getLabelNames().stream()
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .distinct()
                .toList();


        Review review = Review.create(
                userId,
                request.getTargetId(),
                request.getTargetType(),
                request.getApplyId(),
                request.getRating(),
                request.getContent(),
                labels
        );

        Review saved = reviewRepository.save(review);

        updateMemberRating(
                saved.getTargetId(),
                saved.getRating(),
                1
        );

        return ReviewResponse.from(saved);
    }
    public ReviewResponse getReview(Long reviewId) {
        Review review = reviewRepository.findWithLabelsById(reviewId)
                .orElseThrow(() -> new ReviewException("리뷰를 찾을 수 없습니다."));
        return ReviewResponse.from(review);
    }

    public List<ReviewResponse> getReviewsByTarget(Long targetId) {
        return reviewRepository.findAllByTargetId(targetId)
                .stream()
                .map(ReviewResponse::from)
                .toList();
    }

    public List<ReviewResponse> getReviewsByWriter(Long writerId) {
        return reviewRepository.findAllByWriterId(writerId)
                .stream()
                .map(ReviewResponse::from)
                .toList();
    }
    // 리뷰 수정
    @Transactional
    public ReviewResponse updateReview(Long reviewId, Long userId, ReviewUpdateRequest request) {

        Review review = reviewRepository.findWithLabelsById(reviewId)
                .orElseThrow(() -> new ReviewException("리뷰를 찾을 수 없습니다."));

        if (!review.getWriterId().equals(userId)) {
            throw new ReviewException("본인이 작성한 리뷰만 수정할 수 있습니다.");
        }

        List<String> labels = request.getLabelNames().stream()
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .distinct()
                .toList();

        int oldRating = review.getRating();

        review.update(
                request.getRating(),
                request.getContent(),
                labels
        );

        updateMemberRating(
                review.getTargetId(),
                request.getRating() - oldRating,
                0
        );

        return ReviewResponse.from(review);
    }
    // 리뷰 삭제
    @Transactional
    public void deleteReview(Long reviewId, Long userId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewException("리뷰를 찾을 수 없습니다."));

        if (!review.getWriterId().equals(userId)) {
            throw new ReviewException("본인이 작성한 리뷰만 삭제할 수 있습니다.");
        }

        int rating = review.getRating();
        Long targetId = review.getTargetId();

        reviewRepository.delete(review);

        updateMemberRating(
                targetId,
                -rating,
                -1
        );
    }

    private void validateCreatableReview(Apply apply, Integer rating, List<String> labelNames) {
        if (apply.getStatus() != ApplyStatus.COMPLETED) {
            throw new ReviewException("완료된 지원 건에 대해서만 리뷰를 작성할 수 있습니다.");
        }

        if (rating < 1 || rating > 5) {
            throw new ReviewException("별점은 1점 이상 5점 이하만 가능합니다.");
        }

        if (labelNames == null || labelNames.isEmpty()) {
            throw new ReviewException("리뷰 라벨은 최소 1개 이상 선택해야 합니다.");
        }
    }

    private void validateWriterAndTarget(
            Long userId,
            Apply apply,
            ReviewTargetType targetType,
            Long targetId
    ) {
        Recruit recruit = recruitRepository.findById(apply.getRecruitId())
                .orElseThrow(() -> new ReviewException("공고 정보를 찾을 수 없습니다."));

        Long personalMemberId = apply.getIndividualId();
        Long businessMemberId = recruit.getBusinessMemberId();

        // 개인회원이 사업자회원에게 리뷰 작성
        if (targetType == ReviewTargetType.BUSINESS) {
            if (!personalMemberId.equals(userId)) {
                throw new ReviewException("해당 지원의 개인 회원만 사업자 리뷰를 작성할 수 있습니다.");
            }

            if (!businessMemberId.equals(targetId)) {
                throw new ReviewException("리뷰 대상 사업자 회원 정보가 올바르지 않습니다.");
            }
        }

        // 사업자회원이 개인회원에게 리뷰 작성
        if (targetType == ReviewTargetType.INDIVIDUAL) {
            if (!businessMemberId.equals(userId)) {
                throw new ReviewException("해당 공고의 사업자 회원만 개인 리뷰를 작성할 수 있습니다.");
            }

            if (!personalMemberId.equals(targetId)) {
                throw new ReviewException("리뷰 대상 개인 회원 정보가 올바르지 않습니다.");
            }
        }
    }

    //
    private void updateMemberRating(Long memberId, int diffSum, int diffCount) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ReviewException("회원을 찾을 수 없습니다."));

        int newSum = member.getRatingSum() + diffSum;
        int newCount = member.getRatingCount() + diffCount;

        member.setRatingSum(newSum);
        member.setRatingCount(newCount);

        double avg = newCount == 0 ? 0 : (double) newSum / newCount;

        // individual profile 업데이트
        IndividualProfile profile = individualProfileRepository.findByMemberId(memberId)
                .orElseThrow(() -> new ReviewException("개인 프로필이 존재하지 않습니다."));

        profile.setIsSpecial(avg >= 4.0);
    }
}