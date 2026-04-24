package com.example.aibe5_project2_team7.career;

import com.example.aibe5_project2_team7.resume.Resume;
import com.example.aibe5_project2_team7.resume.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CareerService {
    private final CareerRepository careerRepository;
    private final ResumeRepository resumeRepository;

    @Transactional
    public Career create(Career c) {
        Career career = new Career();
        career.setMemberId(c.getMemberId());
        career.setCompany(c.getCompany());
        career.setRole(c.getRole());
        career.setStartDate(c.getStartDate());
        career.setEndDate(c.getEndDate());
        career.setBrandId(c.getBrandId()); // 이것도 꼭

        return careerRepository.save(career);
    }

    @Transactional
    public Career update(Long id, Career c) {
        Career career = careerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("career not found"));

        career.setCompany(c.getCompany());
        career.setRole(c.getRole());
        career.setStartDate(c.getStartDate());
        career.setEndDate(c.getEndDate());
        career.setBrandId(c.getBrandId());

        return careerRepository.save(career);
    }

    @Transactional
    public void delete(Long careerId) {
        Career career = careerRepository.findById(careerId)
                .orElseThrow(() -> new RuntimeException("career not found"));

        Resume resume = resumeRepository.findByCareers_Id(careerId)
                .orElseThrow(() -> new RuntimeException("resume not found"));

        resume.getCareers().remove(career);
        resumeRepository.save(resume);

        careerRepository.delete(career);
    }

    public Career get(Long id) {
        return careerRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    public List<Career> listByMember(Long memberId) {
        return careerRepository.findByMemberId(memberId);
    }
}
