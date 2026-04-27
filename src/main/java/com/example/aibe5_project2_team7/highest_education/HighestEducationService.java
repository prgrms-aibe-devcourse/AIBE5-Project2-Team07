package com.example.aibe5_project2_team7.highest_education;

import com.example.aibe5_project2_team7.resume.Resume;
import com.example.aibe5_project2_team7.resume.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HighestEducationService {
    private final HighestEducationRepository highestEducationRepository;
    private final ResumeRepository resumeRepository;
    @Transactional
    public HighestEducation create(HighestEducation e) {
        Resume resume = resumeRepository.findByMemberId(e.getMemberId())
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Resume not found for member"));

        HighestEducation education = new HighestEducation();
        education.setMemberId(e.getMemberId());
        education.setSchoolName(e.getSchoolName());
        education.setSchoolType(e.getSchoolType());
        education.setMajor(e.getMajor());

        education.setResume(resume); // 핵심

        return highestEducationRepository.save(education);
    }
    public HighestEducation update(Long id, HighestEducation e){
        HighestEducation ex = highestEducationRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        ex.setSchoolName(e.getSchoolName());
        ex.setSchoolType(e.getSchoolType());
        ex.setMajor(e.getMajor());
        return highestEducationRepository.save(ex);
    }
    @Transactional
    public void delete(Long id) {
        HighestEducation education = highestEducationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        Resume resume = resumeRepository.findByEducations_Id(id)
                .orElseThrow(() -> new RuntimeException("resume not found"));

        resume.getEducations().remove(education);
        resumeRepository.save(resume);

        highestEducationRepository.delete(education);
    }
    public HighestEducation get(Long id){ return highestEducationRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found")); }
    public List<HighestEducation> listByMember(Long memberId){ return highestEducationRepository.findByMemberId(memberId); }
}
