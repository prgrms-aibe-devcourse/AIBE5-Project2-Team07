package com.example.aibe5_project2_team7.file;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class StoredFile {
    private String originalName;
    private String storedName;
    private String url;

    public StoredFile(String originalName, String storedName, String url) {
        this.originalName = originalName;
        this.storedName = storedName;
        this.url = url;
    }
}
