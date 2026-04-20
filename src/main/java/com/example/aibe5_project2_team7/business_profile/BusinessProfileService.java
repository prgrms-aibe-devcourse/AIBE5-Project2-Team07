package com.example.aibe5_project2_team7.business_profile;

import com.example.aibe5_project2_team7.business_profile.request.BusinessCompanyEditRequest;
import com.example.aibe5_project2_team7.business_profile.request.BusinessMemberEditRequest;
import com.example.aibe5_project2_team7.business_profile.response.BusinessProfileResponse;
import com.example.aibe5_project2_team7.brand.entity.Brand;
import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.MemberType;
import com.example.aibe5_project2_team7.member.repository.MemberRepository;
import com.example.aibe5_project2_team7.member_address.MemberAddress;
import com.example.aibe5_project2_team7.member_address.MemberAddressRepository;
import com.example.aibe5_project2_team7.region.Region;
import com.example.aibe5_project2_team7.region.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
@RequiredArgsConstructor
public class BusinessProfileService {
	private final MemberRepository memberRepository;
	private final BusinessProfileRepository businessProfileRepository;
	private final MemberAddressRepository memberAddressRepository;
	private final RegionRepository regionRepository;
	private final BCryptPasswordEncoder passwordEncoder;

	@Transactional(readOnly = true)
	public BusinessProfileResponse getMyProfileByEmail(String email) {
		if (email == null || email.isBlank()) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "인증 정보가 없습니다.");
		}

		Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."));

		return buildBusinessProfileResponse(member);
	}

	private BusinessProfileResponse buildBusinessProfileResponse(Member member) {

		if (member.getMemberType() != MemberType.BUSINESS) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "사업자 회원만 조회할 수 있습니다.");
		}

		BusinessProfile profile = businessProfileRepository.findByMemberId(member.getId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사업자 프로필을 찾을 수 없습니다."));

		MemberAddress memberAddress = memberAddressRepository.findByMemberId_Id(member.getId())
				.orElse(null);

		String brandName = null;
		if (profile.getBrandId() != null) {
			Brand brand = profile.getBrandId();
			brandName = brand.getName();
		}

		return BusinessProfileResponse.from(profile, member, memberAddress, brandName);
	}

	public void editMyMemberByEmail(String email, BusinessMemberEditRequest request) {
		if (email == null || email.isBlank()) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "인증 정보가 없습니다.");
		}
		if (request == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정할 정보가 없습니다.");
		}

		String phone = request.getPhone();
		Integer regionId = request.getRegionId();
		String detailAddress = request.getDetailAddress();

		if (phone == null || phone.isBlank() || regionId == null || detailAddress == null || detailAddress.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "phone, regionId, detailAddress는 필수입니다.");
		}

		Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."));

		if (member.getMemberType() != MemberType.BUSINESS) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "사업자 회원만 수정할 수 있습니다.");
		}

		if (memberRepository.existsByPhoneAndIdNot(phone, member.getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 전화번호입니다.");
		}

		Region region = regionRepository.findById(regionId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "지역 정보를 찾을 수 없습니다."));

		member.setPhone(phone);

		MemberAddress memberAddress = memberAddressRepository.findByMemberId_Id(member.getId())
				.orElseGet(() -> {
					MemberAddress newAddress = new MemberAddress();
					newAddress.setMemberId(member);
					return newAddress;
				});

		memberAddress.setRegion(region);
		memberAddress.setDetailAddress(detailAddress);

		memberAddressRepository.save(memberAddress);
	}

	public void editMyPasswordByEmail(String email, com.example.aibe5_project2_team7.business_profile.request.BusinessPasswordEditRequest request) {
		if (email == null || email.isBlank()) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "인증 정보가 없습니다.");
		}
		if (request == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청 정보가 없습니다.");
		}

		String original = request.getOriginalPassword();
		String nw = request.getNewPassword();
		String nwConfirm = request.getNewPasswordConfirm();

		if (original == null || original.isBlank() || nw == null || nw.isBlank() || nwConfirm == null || nwConfirm.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "모든 비밀번호 필드를 입력하세요.");
		}

		if (!nw.equals(nwConfirm)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "새 비밀번호와 확인이 일치하지 않습니다.");
		}

		Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."));

		// 권한 확인
		if (member.getMemberType() != MemberType.BUSINESS) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "사업자 회원만 수정할 수 있습니다.");
		}

		// 기존 비밀번호 확인
		if (!passwordEncoder.matches(original, member.getPassword())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "기존 비밀번호가 일치하지 않습니다.");
		}

		// 업데이트
		member.setPassword(passwordEncoder.encode(nw));
		memberRepository.save(member);
	}

	public void editMyCompanyByEmail(String email, BusinessCompanyEditRequest request) {
		if (email == null || email.isBlank()) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "인증 정보가 없습니다.");
		}
		if (request == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정할 회사 정보가 없습니다.");
		}

		java.time.LocalDate foundedDate = request.getFoundedDate();
		String companyName = request.getCompanyName();
		String businessNumber = request.getBusinessNumber();

		if (foundedDate == null || companyName == null || companyName.isBlank() || businessNumber == null || businessNumber.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "foundedDate, companyName, businessNumber는 필수입니다.");
		}

		Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."));

		if (member.getMemberType() != MemberType.BUSINESS) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "사업자 회원만 수정할 수 있습니다.");
		}

		BusinessProfile profile = businessProfileRepository.findByMemberId(member.getId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사업자 프로필을 찾을 수 없습니다."));

		profile.setFoundedDate(foundedDate);
		profile.setCompanyName(companyName);
		profile.setBusinessNumber(businessNumber);

		businessProfileRepository.save(profile);
	}
}
