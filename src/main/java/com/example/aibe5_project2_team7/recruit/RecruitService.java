package com.example.aibe5_project2_team7.recruit;

import com.example.aibe5_project2_team7.brand.BrandRepository;
import com.example.aibe5_project2_team7.brand.entity.Brand;
import com.example.aibe5_project2_team7.business_profile.BusinessProfile;
import com.example.aibe5_project2_team7.business_profile.BusinessProfileRepository;
import com.example.aibe5_project2_team7.naverapi.service.NaverMapService;
import com.example.aibe5_project2_team7.recruit.constant.*;
import com.example.aibe5_project2_team7.recruit.dto.RecruitDetailResponseDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitListResponseDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitRequestDto;
import com.example.aibe5_project2_team7.recruit.dto.RecruitSearchConditionDto;
import com.example.aibe5_project2_team7.recruit.entity.*;
import com.example.aibe5_project2_team7.region.Region;
import com.example.aibe5_project2_team7.region.RegionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RecruitService {
    private final RecruitRepository recruitRepository;
    private final RegionRepository regionRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final BrandRepository brandRepository;
    private final NaverMapService naverMapService;
    //공고 전체 목록 조회 (필터/정렬 포함)
    public Page<RecruitListResponseDto> getRecruitList(RecruitSearchConditionDto cond, int page, int size) {
        // 정렬 기준 결정
        Sort sort = switch (cond.getSort() != null ? cond.getSort() : "LATEST") {
            case "DEADLINE" -> Sort.by(Sort.Direction.ASC, "deadline");
            default         -> Sort.by(Sort.Direction.DESC, "createdAt"); // LATEST
        };
        Pageable pageable = PageRequest.of(page - 1, size, sort); // 명세는 page=1 시작

        // type=SHORT가 아닐 때 workDate 무시
        LocalDate workDate = "SHORT".equals(cond.getType()) ? cond.getWorkDate() : null;

        return recruitRepository.findWithFilters(
                cond.getType(),
                cond.getKeyword(),
                cond.getRegionId(),
                workDate,
                cond.getWorkPeriod(),
                cond.getWorkDays(),
                cond.getWorkTime(),
                cond.getBusinessType(),
                cond.getMemberId(),
                cond.isUrgent(),
                RecruitStatus.EXPIRED,
                pageable
        ).map(this::toListResponse);
    }


    //공고 상세 조회
    public RecruitDetailResponseDto getRecruitDetail(Long recruitId) {
        Recruit recruit = getRecruitById(recruitId); //recruit id로 공고 가져오기
        return toDetailResponse(recruit); //엔티티를 상세조회용 DTO로 변환
    }

    //사업자별 공고 조회
    public List<RecruitListResponseDto> findByBusinessMemberId(Long businessMemberId) {
        List<Recruit> recruits = recruitRepository.findByBusinessMemberId(businessMemberId); //사업자 ID로 공고 리스트 조회
        return recruits.stream() //엔티티 리스트를 DTO 리스트로 변환
                .map(this::toListResponse)
                .toList();
    }

    //공고 등록
    @Transactional
    public Long createRecruit(RecruitRequestDto requestDto, Long requestBusinessId) {
        Recruit newRecruit = new Recruit();
        Region region = getRegion(requestDto.getRegionId());
        Brand brand = (requestDto.getBrandId() != null)
                ? brandRepository.findById(requestDto.getBrandId()).orElse(null)
                : null;
        applyRequestToRecruit(newRecruit, requestDto, region, brand);
        newRecruit.setBusinessMemberId(requestBusinessId);
        validateDeadline(requestDto.getDeadline());
        replaceWorkPeriods(newRecruit, requestDto.getWorkPeriod());
        replaceWorkDays(newRecruit, requestDto.getWorkDays());
        replaceWorkTimes(newRecruit, requestDto.getWorkTime());
        replaceBusinessTypes(newRecruit, requestDto.getBusinessType());

        double coord[] = naverMapService.getCoordinates(region.getSido()+" "+region.getSigungu()+" "+requestDto.getDetailAddress());
        newRecruit.setDetailAddress(requestDto.getDetailAddress());
        if(coord!=null) {
            newRecruit.setLatitude(coord[0]);
            newRecruit.setLongitude(coord[1]);
        }
        return recruitRepository.save(newRecruit).getId();
    }

    //공고 수정
    //지원자가 지원 후 수정할시 혼동이 오기 때문에 상태 변경만 수정 가능
    @Transactional
    public Long updateRecruit(Long recruitId, RecruitStatus status, Long requestBusinessId) {
        Recruit recruit = getRecruitById(recruitId); //공고 Id로 공고 조회
        validateRequester(recruit, requestBusinessId); //작성자 검증
        recruit.setStatus(status); //변경된 상태로 설정
        return recruit.getId(); //수정된 recruit의 ID 반환
    }

    //공고 삭제
    @Transactional
    public void deleteRecruit(Long recruitId, Long requestBusinessId) {
        Recruit recruit = getRecruitById(recruitId); //공고 조회
        validateRequester(recruit, requestBusinessId); //작성자 검증
        recruitRepository.delete(recruit); //삭제
    }

    //id로 공고 가져오기
    private Recruit getRecruitById(Long recruitId){
        Recruit recruit = recruitRepository.findById(recruitId)
                .orElseThrow((EntityNotFoundException::new));
        return recruit;
    }

    //region id로 region 엔티티 조회
    private Region getRegion(Integer regionId){
        if(regionId == null) {
            throw new IllegalArgumentException("regionId는 필수입니다.");
        }
        return regionRepository.findById(regionId)
                .orElseThrow((EntityNotFoundException::new));
    }

    //공고 수정 또는 삭제 기능을 위해 소유 사업자 검증
    private void validateRequester(Recruit recruit, Long requestBusinessId){
        if(!recruit.getBusinessMemberId().equals(requestBusinessId)){
            throw new IllegalArgumentException("권한이 없습니다.");
        }
    }

    //마감일 검증
    private void validateDeadline(LocalDate deadlineDate) {
        if(deadlineDate == null) {
            throw new IllegalArgumentException("마감일은 필수입니다.");
        }
        if(deadlineDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("마감일은 오늘 이후여야 합니다.");
        }
    }

    //엔티티를 목록조회용dto로 변환 (공개 메서드 - 다른 서비스에서 재사용 가능)
    public RecruitListResponseDto toListResponse(Recruit recruit){
        BusinessProfile profile = businessProfileRepository
                .findByMemberId(recruit.getBusinessMemberId())
                .orElse(null);
        String regionName = recruit.getRegion().getSido() + " " + recruit.getRegion().getSigungu();

        return RecruitListResponseDto.builder()
                .id(recruit.getId())
                .title(recruit.getTitle())
                .companyName(profile != null ? profile.getCompanyName() : null)
                // 상세 페이지와 동일하게 브랜드 공고면 브랜드 로고 우선 사용
                .companyImageUrl(recruit.getBrand() != null ? recruit.getBrand().getLogoImg() : (profile != null ? profile.getCompanyImageUrl() : null))
                .isUrgent(recruit.isUrgent())
                .salary(recruit.getSalary())
                .salaryType(recruit.getSalaryType())
                .workPeriod(recruit.getWorkPeriod().stream().map(WorkPeriod::getPeriod).toList())
                .workDays(recruit.getWorkDays().stream().map(WorkDays::getDay).toList())
                .workTime(recruit.getWorkTime().stream().map(WorkTime::getTimes).toList())
                .businessType(recruit.getBusinessType().stream().map(BusinessType::getType).toList())
                .deadline(recruit.getDeadline())
                .regionId(recruit.getRegion().getId())
                .regionName(regionName)
                .detailAddress(recruit.getDetailAddress())
                .createdAt(recruit.getCreatedAt() != null ? recruit.getCreatedAt().toLocalDate() : null)
                .status(recruit.getStatus())
                .build();
    }

    //엔티티를 상세조회용dto로 변환
    private RecruitDetailResponseDto toDetailResponse(Recruit recruit){
        // 사업자 프로필 조회 (없으면 null 허용)
        BusinessProfile profile = businessProfileRepository
                .findByMemberId(recruit.getBusinessMemberId())
                .orElse(null);

        return RecruitDetailResponseDto.builder()
                .id(recruit.getId())
                .title(recruit.getTitle())
                .companyName(profile != null ? profile.getCompanyName() : null)
                .businessType(recruit.getBusinessType().stream().map(BusinessType::getType).toList())
                // 상세 페이지 정책: 브랜드 공고(brandId 존재)인 경우에만 로고 제공
                .logoImg(recruit.getBrand() != null ? recruit.getBrand().getLogoImg() : null)
                .isUrgent(recruit.isUrgent())
                .status(recruit.getStatus())
                .salary(recruit.getSalary())
                .salaryType(recruit.getSalaryType())
                .workPeriod(recruit.getWorkPeriod().stream().map(WorkPeriod::getPeriod).toList())
                .workDays(recruit.getWorkDays().stream().map(WorkDays::getDay).toList())
                .workTime(recruit.getWorkTime().stream().map(WorkTime::getTimes).toList())
                .headCount(recruit.getHeadCount())
                .deadline(recruit.getDeadline())
                .fullAddress(recruit.getRegion().getSido() + recruit.getRegion().getSigungu() + recruit.getDetailAddress())
                .description(recruit.getDescription())
                .resumeFormUrl(recruit.getResumeFormUrl())
                .brandId(recruit.getBrand() != null ? recruit.getBrand().getId() : null)
                .brandName(recruit.getBrand() != null ? recruit.getBrand().getName() : null)
                .companyPhone(profile != null ? profile.getCompanyPhone() : null)
                .homepageUrl(profile != null ? profile.getHomepageUrl() : null)
                .latitude(recruit.getLatitude())      // 엔티티에 latitude 필드 있으면 추가
                .longitude(recruit.getLongitude())    // 엔티티에 longitude 필드 있으면 추가
                .businessMemberId(recruit.getBusinessMemberId())
                // reviewSummary → 리뷰 기능 구현 후 추가 예정
                // applyStatus  → 로그인/지원 기능 구현 후 추가 예정
                .build();
    }

    //등록 요청 dto의 내용을 엔티티에 반영
    private void applyRequestToRecruit(Recruit recruit, RecruitRequestDto requestDto, Region region, Brand brand){
        recruit.setTitle(requestDto.getTitle());
        recruit.setBrand(brand);
        recruit.setUrgent(requestDto.isUrgent());
        recruit.setDeadline(requestDto.getDeadline());
        recruit.setStatus(RecruitStatus.OPEN);
        recruit.setSalary(requestDto.getSalary());
        recruit.setSalaryType(requestDto.getSalaryType());
        recruit.setHeadCount(requestDto.getHeadCount());
        recruit.setRegion(region);
        recruit.setDetailAddress(requestDto.getDetailAddress());
        recruit.setDescription(requestDto.getDescription());
        recruit.setResumeFormUrl(requestDto.getResumeFormUrl());
    }

    //근무기간,시간,요일,업종 컬렉션 전체 교체
    private void replaceWorkPeriods(Recruit recruit, List<Period> periods){
        recruit.getWorkPeriod().clear();
        for(Period period : periods) {
            WorkPeriod wp = new WorkPeriod();
            wp.setRecruit(recruit);
            wp.setPeriod(period);
            recruit.getWorkPeriod().add(wp);
        }
    }
    private void replaceWorkDays(Recruit recruit, List<Days> days){
        recruit.getWorkDays().clear();
        for(Days day : days) {
            WorkDays wd = new WorkDays();
            wd.setRecruit(recruit);
            wd.setDay(day);
            recruit.getWorkDays().add(wd);
        }
    }
    private void replaceWorkTimes(Recruit recruit, List<Times> times){
        recruit.getWorkTime().clear();
        for(Times time : times) {
            WorkTime wt = new WorkTime();
            wt.setRecruit(recruit);
            wt.setTimes(time);
            recruit.getWorkTime().add(wt);
        }
    }
    private void replaceBusinessTypes(Recruit recruit, List<BusinessTypeName> businessTypeNames){
        recruit.getBusinessType().clear();
        for(BusinessTypeName businessTypeName : businessTypeNames) {
            BusinessType bt = new BusinessType();
            bt.setRecruit(recruit);
            bt.setType(businessTypeName);
            recruit.getBusinessType().add(bt);
        }
    }

}
