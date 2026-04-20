package com.example.aibe5_project2_team7.scrap_recruit;

import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.recruit.entity.Recruit;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Table(name = "scrap_recruit")
@Getter @Setter
public class ScrapRecruit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member; //스크랩을 한 개인회원

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruit_id", nullable = false)
    private Recruit recruit; //스크랩을 당한 공고
}
