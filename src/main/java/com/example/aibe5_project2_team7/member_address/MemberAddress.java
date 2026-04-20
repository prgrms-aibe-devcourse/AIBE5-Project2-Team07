package com.example.aibe5_project2_team7.member_address;

import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.region.Region;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name="member_address")
public class MemberAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id", nullable = false)
    private Member memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="region_id", nullable = false)
    private Region region;

    @Column(name = "detail_address", nullable = false)
    private String detailAddress;
}
