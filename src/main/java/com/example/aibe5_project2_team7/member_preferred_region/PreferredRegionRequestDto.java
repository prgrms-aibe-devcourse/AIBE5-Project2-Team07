package com.example.aibe5_project2_team7.member_preferred_region;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PreferredRegionRequestDto {
    private List<Integer> regionIds;
}
