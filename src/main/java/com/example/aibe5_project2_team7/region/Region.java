package com.example.aibe5_project2_team7.region;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(
        name="region",
        uniqueConstraints = {
            @UniqueConstraint(
                    name = "unique_region_sido_sigungu",
                    columnNames = {"sido", "sigungu"})
        }
)
public class Region {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 20, nullable = false)
    private String sido;    //시,도

    @Column(length = 50, nullable = false)
    private String sigungu; //시,군,구
}
