package com.example.aibe5_project2_team7.member_preferred_region;

import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.repository.MemberRepository;
import com.example.aibe5_project2_team7.region.Region;
import com.example.aibe5_project2_team7.region.RegionRepository;
import com.example.aibe5_project2_team7.region.RegionResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberPreferredRegionService {
    private final MemberPreferredRegionRepository repository;
    private final RegionRepository regionRepository;
    private final MemberRepository memberRepository;

    public List<RegionResponseDto> getPreferredRegions(Long memberId) {
        List<MemberPreferredRegion> mappings = repository.findByMemberId(memberId);
        if (mappings == null || mappings.isEmpty()) return List.of();
        return mappings.stream().map(mpr -> RegionResponseDto.from(mpr.getRegion())).collect(Collectors.toList());
    }

    @Transactional
    public void replacePreferredRegions(Long memberId, List<Integer> regionIds) {
        // 기존 매핑 삭제
        List<MemberPreferredRegion> existing = repository.findByMemberId(memberId);
        if (existing != null && !existing.isEmpty()) {
            repository.deleteAll(existing);
        }

        if (regionIds == null || regionIds.isEmpty()) return;

        Member member = memberRepository.findById(memberId).orElse(null);
        if (member == null) return;

        List<MemberPreferredRegion> toSave = new ArrayList<>();
        for (Integer rid : regionIds) {
            if (rid == null) continue;
            Optional<Region> regionOpt = regionRepository.findById(rid);
            regionOpt.ifPresent(region -> {
                MemberPreferredRegion mpr = new MemberPreferredRegion();
                mpr.setMember(member);
                mpr.setRegion(region);
                toSave.add(mpr);
            });
        }

        if (!toSave.isEmpty()) repository.saveAll(toSave);
    }
}
