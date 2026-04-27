package com.example.aibe5_project2_team7.file;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {
    @Value("${upload.local.dir:uploads}")
    private String uploadDir;

    private Path getUploadPath() {
        return Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public StoredFile storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename());
        // 경로 조작 방지
        if (originalName.contains("..")) {
            throw new IllegalArgumentException("잘못된 파일명입니다.");
        }

        String storedName = UUID.randomUUID().toString() + "_" + originalName;

        try {
            Path uploadPath = getUploadPath();
            Files.createDirectories(uploadPath);

            Path target = uploadPath.resolve(storedName);
            file.transferTo(target.toFile());

            log.info("File stored: {}", target.toString());

            // 반환값에 웹에서 접근 가능한 URL 로직은 WebConfig의 ResourceHandler와 맞추세요.
            String url = "/uploads/" + storedName; // WebConfig에서 /uploads/** -> file:uploads/ 로 매핑한다면 사용 가능
            return new StoredFile(originalName, storedName, url);
        } catch (IOException e) {
            log.error("파일 저장 실패", e);
            throw new RuntimeException("파일 저장 실패", e);
        }
    }

    // FileStorageService 클래스 내부에 추가
    private Path getUploadPath(String subDir) {
        if (subDir == null || subDir.isBlank()) {
            return Paths.get(uploadDir).toAbsolutePath().normalize();
        }
        return Paths.get(uploadDir, subDir).toAbsolutePath().normalize();
    }

    public StoredFile storeFile(MultipartFile file, String subDir) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename());
        if (originalName.contains("..")) {
            throw new IllegalArgumentException("잘못된 파일명입니다.");
        }

        String storedName = UUID.randomUUID().toString() + "_" + originalName;

        try {
            Path uploadPath = getUploadPath(subDir);
            Files.createDirectories(uploadPath);

            Path target = uploadPath.resolve(storedName);
            file.transferTo(target.toFile());

            log.info("File stored: {}", target.toString());

            String url = "/uploads/" + (subDir != null && !subDir.isBlank() ? subDir + "/" : "") + storedName;
            return new StoredFile(originalName, storedName, url);
        } catch (IOException e) {
            log.error("파일 저장 실패", e);
            throw new RuntimeException("파일 저장 실패", e);
        }
    }

    // 파일 삭제 (URL 또는 storedName 을 받아서 실제 파일 시스템에서 삭제)
    public boolean deleteFileByUrl(String url) {
        if (url == null || url.isBlank()) return false;
        // url 예: /uploads/resumes/uuid_name.pdf -> 상대 경로로 변환
        String prefix = "/uploads/";
        if (!url.startsWith(prefix)) {
            log.warn("Unsupported url format for deletion: {}", url);
            return false;
        }
        String relativePath = url.substring(prefix.length()); // resumes/uuid_name.pdf or uuid_name.pdf
        Path filePath = Paths.get(uploadDir).resolve(relativePath).toAbsolutePath().normalize();
        try {
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.error("파일 삭제 실패: {}", filePath, e);
            return false;
        }
    }
}
