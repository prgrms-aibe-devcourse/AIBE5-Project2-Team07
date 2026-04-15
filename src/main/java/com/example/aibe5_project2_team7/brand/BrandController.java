package com.example.aibe5_project2_team7.brand;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
public class BrandController {
    private final BrandService brandService;

    @GetMapping(value = "/api/brand/search/autocomplete")
    public @ResponseBody ResponseEntity<List<BrandSearchAutoCompleteDto>> search(
            @RequestParam(name = "q", required = false) String q) {

        if (q == null || q.trim().isEmpty()) {
            // empty query -> return empty list (200) for autocomplete UX
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<BrandSearchAutoCompleteDto> results = brandService.getSearchList(q.trim());
        return ResponseEntity.ok(results);
    }
}
