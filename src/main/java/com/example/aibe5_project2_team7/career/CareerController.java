package com.example.aibe5_project2_team7.career;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/personal/career")
@RequiredArgsConstructor
public class CareerController {
    private final CareerService careerService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Career c) {
        return ResponseEntity.ok(careerService.create(c));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Career c) {
        return ResponseEntity.ok(careerService.update(id, c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        careerService.delete(id);
        return ResponseEntity.ok(Map.of("message", "deleted"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return ResponseEntity.ok(careerService.get(id));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<?> listByMember(@PathVariable Long memberId) {
        List<Career> list = careerService.listByMember(memberId);
        return ResponseEntity.ok(list);
    }
}
