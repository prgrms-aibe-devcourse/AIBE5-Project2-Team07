package com.example.aibe5_project2_team7.scrap_member;

import com.example.aibe5_project2_team7.business_profile.BusinessProfile;
import com.example.aibe5_project2_team7.individual_profile.IndividualProfile;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Table(name="scrap_member")
public class ScrapMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_profile", nullable = false)
    private BusinessProfile businessProfile; //스크랩을 한 사업자 회원

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "individual_profile", nullable = false)
    private IndividualProfile individualProfile; //스크랩을 당한 개인 회원
}
