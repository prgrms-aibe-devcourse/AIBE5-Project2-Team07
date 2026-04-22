package com.example.aibe5_project2_team7.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${upload.local.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /uploads/** -> 절대경로로 변환하여 매핑
        java.io.File dir = new java.io.File(uploadDir);
        String absolutePath = dir.getAbsolutePath();
        String location = "file:" + absolutePath + (absolutePath.endsWith(java.io.File.separator) ? "" : java.io.File.separator);
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}
