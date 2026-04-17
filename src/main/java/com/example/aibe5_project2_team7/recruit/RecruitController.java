package com.example.aibe5_project2_team7.recruit;

import com.example.aibe5_project2_team7.recruit.constant.RecruitStatus;
import com.example.aibe5_project2_team7.recruit.dto.RecruitDetailResponseDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitListResponseDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitRequestDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitSearchConditionDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitStatusUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RecruitController {
	private final RecruitService recruitService;

	@GetMapping("/recruits") // 전체/단기/중장기 공고 리스트 조회
	public Page<RecruitListResponseDto> getRecruitList(
			@ModelAttribute RecruitSearchConditionDto condition,
			@RequestParam(defaultValue = "1") int page,
			@RequestParam(defaultValue = "20") int size
	) {
		return recruitService.getRecruitList(condition, page, size);
	}

	@GetMapping("/recruits/{recruit_id}") //공고 상세 조회
	public RecruitDetailResponseDto getRecruitDetail(@PathVariable("recruit_id") Long recruitId) {
		return recruitService.getRecruitDetail(recruitId);
	}

	@GetMapping("/recruits/business/{businessMemberId}") //공고 기업명으로 조회
	public List<RecruitListResponseDto> getRecruitsByBusinessMemberId(@PathVariable Long businessMemberId) {
		return recruitService.findByBusinessMemberId(businessMemberId);
	}

	@GetMapping("/business/myrecruit") //본인 공고 목록
	public List<RecruitListResponseDto> getMyRecruitList(
			@RequestHeader(name="X-Member-Id", defaultValue = "1") Long requesterMemberId
	) {
		return recruitService.findByBusinessMemberId(requesterMemberId);
	}

	@PostMapping("/business/recruit/new") //공고 등록
	@ResponseStatus(HttpStatus.CREATED)
	public Long createRecruit(
			@RequestBody RecruitRequestDto requestDto,
			@RequestHeader(name = "X-Member-Id", defaultValue = "1") Long requesterMemberId
	) {
		return recruitService.createRecruit(requestDto, requesterMemberId);
	}

	@PatchMapping("/business/myrecruit/edit") //공고 수정
	public Long updateRecruit(
			@RequestParam("recruitId") Long recruitId,
			@RequestBody RecruitStatusUpdateDto recruitStatusUpdateDto,
			@RequestHeader(name = "X-Member-Id", defaultValue = "1") Long requesterMemberId
	) {
		return recruitService.updateRecruit(recruitId, recruitStatusUpdateDto.getStatus(), requesterMemberId);
	}

	@DeleteMapping("/business/myrecruit/delete") //공고 삭제
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteRecruit(
			@RequestParam("recruitId") Long recruitId,
			@RequestHeader(name = "X-Member-Id", defaultValue = "1") Long requesterMemberId
	) {
		recruitService.deleteRecruit(recruitId, requesterMemberId);
	}
}
