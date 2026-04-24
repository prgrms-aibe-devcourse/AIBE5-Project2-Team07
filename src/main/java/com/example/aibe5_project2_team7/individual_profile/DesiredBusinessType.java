package com.example.aibe5_project2_team7.individual_profile;

import com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter@Setter
public class DesiredBusinessType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "member_id", nullable = false)
    private Long memberId;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BusinessTypeName type;
}
