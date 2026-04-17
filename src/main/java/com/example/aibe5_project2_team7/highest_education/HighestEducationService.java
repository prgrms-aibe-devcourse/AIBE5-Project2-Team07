package com.example.aibe5_project2_team7.highest_education;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HighestEducationService {
    private final HighestEducationRepository highestEducationRepository;

    public HighestEducation create(HighestEducation e){ return highestEducationRepository.save(e); }
    public HighestEducation update(Long id, HighestEducation e){
        HighestEducation ex = highestEducationRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        ex.setSchoolName(e.getSchoolName());
        ex.setSchoolType(e.getSchoolType());
        ex.setMajor(e.getMajor());
        return highestEducationRepository.save(ex);
    }
    public void delete(Long id){ highestEducationRepository.deleteById(id); }
    public HighestEducation get(Long id){ return highestEducationRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found")); }
    public List<HighestEducation> listByMember(Long memberId){ return highestEducationRepository.findByMemberId(memberId); }
}
