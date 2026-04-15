package com.example.aibe5_project2_team7.member.service;

import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    //회원가입
    public Member registerMember(Member member) {
        if (memberRepository.existsByEmail(member.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if(memberRepository.existsByPhone(member.getPhone())){
            throw new RuntimeException("Phone number already exists");
        }
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        return memberRepository.save(member);
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
}