package com.example.aibe5_project2_team7.career;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CareerService {
    private final CareerRepository careerRepository;

    public Career create(Career c) {
        return careerRepository.save(c);
    }

    public Career update(Long id, Career c) {
        Career exist = careerRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        exist.setCompany(c.getCompany());
        exist.setRole(c.getRole());
        exist.setStartDate(c.getStartDate());
        exist.setEndDate(c.getEndDate());
        return careerRepository.save(exist);
    }

    public void delete(Long id) {
        careerRepository.deleteById(id);
    }

    public Career get(Long id) {
        return careerRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    public List<Career> listByMember(Long memberId) {
        return careerRepository.findByMemberId(memberId);
    }
}
