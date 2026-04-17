package com.example.aibe5_project2_team7.license;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/personal/license")
@RequiredArgsConstructor
public class LicenseController {
    private final LicenseService licenseService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody License l){
        return ResponseEntity.ok(licenseService.create(l));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody License l){
        return ResponseEntity.ok(licenseService.update(id,l));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        licenseService.delete(id);
        return ResponseEntity.ok(Map.of("message","deleted"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id){
        return ResponseEntity.ok(licenseService.get(id));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<?> listByMember(@PathVariable Long memberId){
        List<License> list = licenseService.listByMember(memberId);
        return ResponseEntity.ok(list);
    }
}
