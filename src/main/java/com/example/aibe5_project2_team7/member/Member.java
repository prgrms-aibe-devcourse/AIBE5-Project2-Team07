package com.example.aibe5_project2_team7.member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter @Setter
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private LocalDate birthDate;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;
    @Column(nullable = false)
    private String phone; //전화번호
    @Column(nullable = false)
    private String email; //이메일 = 로그인 아이디
    private String image;
    @Column(nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberType memberType;
    @Column(nullable = false)
    private Integer ratingSum;
    @Column(nullable = false)
    private Integer ratingCount;
}
