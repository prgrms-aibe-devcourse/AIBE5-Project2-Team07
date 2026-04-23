package com.example.aibe5_project2_team7.member.dto;

import com.example.aibe5_project2_team7.member.Gender;
import com.example.aibe5_project2_team7.member.MemberType;
import com.example.aibe5_project2_team7.region.Region;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberResponseDto {
    private Long id;
    private String name;
    private LocalDate birthDate;
    private Gender gender;
    private String phone; //전화번호
    private String email; //이메일 = 로그인 아이디
    private String image;
    private String password;
    private MemberType memberType;
    private Integer ratingSum;
    private Integer ratingCount;
    private Set<Region> preferredRegions;
    private Double avgScore;

}
