package com.example.aibe5_project2_team7.member.service;

import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.MemberType;
import com.example.aibe5_project2_team7.member.repository.MemberRepository;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfile;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfileRepository;
import com.example.aibe5_project2_team7.business_profile.BusinessProfile;
import com.example.aibe5_project2_team7.business_profile.BusinessProfileRepository;
import com.example.aibe5_project2_team7.member_address.MemberAddress;
import com.example.aibe5_project2_team7.member_address.MemberAddressRepository;
import com.example.aibe5_project2_team7.region.Region;
import com.example.aibe5_project2_team7.region.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final IndividualProfileRepository individualProfileRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final MemberAddressRepository memberAddressRepository;
    private final RegionRepository regionRepository;

    //회원가입
    public Member registerMember(Member member) {
        return registerMember(member, null);
    }

    public Member registerMember(Member member, Map<String, Object> extra) {
        if (memberRepository.existsByEmail(member.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if(memberRepository.existsByPhone(member.getPhone())){
            throw new RuntimeException("Phone number already exists");
        }
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        Member saved = memberRepository.save(member);


        if (saved.getMemberType() == MemberType.INDIVIDUAL) {
            IndividualProfile p = new IndividualProfile();
            p.setMemberId(saved.getId());

            individualProfileRepository.save(p);
        } else if (saved.getMemberType() == MemberType.BUSINESS) {

            if (extra == null) {
                throw new RuntimeException("Business registration requires business profile data");
            }
            BusinessProfile bp = new BusinessProfile();
            bp.setMemberId(saved.getId());
            Object companyName = extra.get("companyName");
            Object foundedDate = extra.get("foundedDate");
            Object businessNumber = extra.get("businessNumber");
            Object companyPhone = extra.get("companyPhone");
            Object companyAddress = extra.get("companyAddress");

            if (companyName == null || foundedDate == null || businessNumber == null || companyPhone == null || companyAddress == null) {
                throw new RuntimeException("Missing required business profile fields");
            }
            bp.setCompanyName(companyName.toString());
            try {
                bp.setFoundedDate(LocalDate.parse(foundedDate.toString()));
            } catch (DateTimeParseException e) {
                throw new RuntimeException("Invalid foundedDate format. Expected ISO date (yyyy-MM-dd)");
            }
            bp.setBusinessNumber(businessNumber.toString());
            bp.setCompanyPhone(companyPhone.toString());
            bp.setCompanyAddress(companyAddress.toString());

            Object companyImageUrl = extra.get("companyImageUrl");
            Object homepageUrl = extra.get("homepageUrl");
            if (companyImageUrl != null) bp.setCompanyImageUrl(companyImageUrl.toString());
            if (homepageUrl != null) bp.setHomepageUrl(homepageUrl.toString());

            businessProfileRepository.save(bp);
        }

        return saved;
    }

    //로그인
    public Member authenticate(String email, String password) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        return member;
    }

    // 회원 탈퇴
    public void deleteMember(Long memberId){
        if(!memberRepository.existsById(memberId)){
            throw new RuntimeException("member not found");
        }
        memberRepository.deleteById(memberId);
    }

    // 회원 정보 수정
    public void updateMember(Long memberId,Map<String, Object> updates){
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("member not found"));
        // 휴대폰 번호 변경
        if (updates.containsKey("phone")) {
            String newPhone = updates.get("phone").toString();
            if (!newPhone.equals(member.getPhone()) && memberRepository.existsByPhone(newPhone)) {
                throw new RuntimeException("Phone number already exists");
            }
            member.setPhone(newPhone);
        }
        // 비밀번호 변경
        if (updates.containsKey("password")) {
            member.setPassword(passwordEncoder.encode(updates.get("password").toString()));
        }
        // 프로필 사진 변경
        if (updates.containsKey("image")) {
            member.setImage(updates.get("image").toString());
        }
        // MemberAddress 변경
        boolean hasSido = updates.containsKey("sido");
        boolean hasSigungu = updates.containsKey("sigungu");
        boolean hasDetailAddress = updates.containsKey("detailAddress");

        if (hasSido || hasSigungu || hasDetailAddress){
            MemberAddress memberAddress = memberAddressRepository.findByMemberId(memberId)
                    .orElseGet(()->{
                       MemberAddress newAddress = new MemberAddress();
                       newAddress.setMemberId(memberId);
                       return newAddress;
                    });
            if (hasSido || hasSigungu) {
                String sido = updates.get("sido").toString();
                String sigungu = updates.get("sigungu").toString();

                Region region = regionRepository.findBySidoAndSigungu(sido, sigungu)
                        .orElseThrow(() -> new RuntimeException("region not found"));
                memberAddress.setRegion(region);
            }

            if(hasDetailAddress){
                memberAddress.setDetailAddress(updates.get("detailAddress").toString());
            }
            memberAddressRepository.save(memberAddress);
        }
        memberRepository.save(member);
    }
}