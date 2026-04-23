package com.example.aibe5_project2_team7.file;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileStorageController {

    private final FileStorageService storageService;

    public FileStorageController(FileStorageService storageService) {
        this.storageService = storageService;
    }

    // 1) 사업자 회원이 공고 올릴 때 올리는 기업용 이력서
    @PostMapping("/upload/resume/business")
    public ResponseEntity<?> uploadBusinessResume(@RequestParam("file") MultipartFile file) {
        StoredFile stored = storageService.storeFile(file, "businessResumes");
        return ResponseEntity.ok(Map.of("url", stored.getUrl(), "originalName", stored.getOriginalName()));
    }

    // 2) 개인 회원이 지원 시 제출하는 이력서
    @PostMapping("/upload/resume/personal")
    public ResponseEntity<?> uploadPersonalResume(@RequestParam("file") MultipartFile file) {
        StoredFile stored = storageService.storeFile(file, "personalResumes");
        return ResponseEntity.ok(Map.of("url", stored.getUrl(), "originalName", stored.getOriginalName()));
    }

    // 3) 개인 프로필 사진
    @PostMapping("/upload/profile")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file,
                                                @RequestParam(value = "oldUrl", required = false) String oldUrl) {
        // 기존 파일이 있으면 삭제 후 새로 업로드
        if (oldUrl != null && !oldUrl.isBlank()) {
            storageService.deleteFileByUrl(oldUrl);
        }
        StoredFile stored = storageService.storeFile(file, "userProfileImg");
        return ResponseEntity.ok(Map.of("url", stored.getUrl(), "originalName", stored.getOriginalName()));
    }

    // 4) 사업자(기업) 로고
    @PostMapping("/upload/logo")
    public ResponseEntity<?> uploadCompanyLogo(@RequestParam("file") MultipartFile file,
                                               @RequestParam(value = "oldUrl", required = false) String oldUrl) {
        // 기존 로고가 있으면 삭제
        if (oldUrl != null && !oldUrl.isBlank()) {
            storageService.deleteFileByUrl(oldUrl);
        }
        StoredFile stored = storageService.storeFile(file, "companyLogo");
        return ResponseEntity.ok(Map.of("url", stored.getUrl(), "originalName", stored.getOriginalName()));
    }

    // 파일 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFile(@RequestParam("url") String url) {
        boolean ok = storageService.deleteFileByUrl(url);
        return ok ? ResponseEntity.ok().build() : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패");
    }
}

