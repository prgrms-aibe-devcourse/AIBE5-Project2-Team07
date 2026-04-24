package com.example.aibe5_project2_team7.highest_education;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/personal/education")
@RequiredArgsConstructor
public class HighestEducationController {
    private final HighestEducationService highestEducationService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody HighestEducation e){
        return ResponseEntity.ok(highestEducationService.create(e));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody HighestEducation e){
        return ResponseEntity.ok(highestEducationService.update(id,e));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        highestEducationService.delete(id);
        return ResponseEntity.ok(Map.of("message","deleted"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id){
        return ResponseEntity.ok(highestEducationService.get(id));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<?> listByMember(@PathVariable Long memberId){
        List<HighestEducation> list = highestEducationService.listByMember(memberId);
        return ResponseEntity.ok(list);
    }
}
