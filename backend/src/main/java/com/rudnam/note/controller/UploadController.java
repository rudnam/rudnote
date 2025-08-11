package com.rudnam.note.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final AmazonS3 amazonS3;
    private final String bucketName;
    private final String r2Endpoint;

    @Autowired
    public UploadController(AmazonS3 amazonS3,
                            @Value("${r2.bucket}") String bucketName,
                            @Value("${r2.endpoint}") String r2Endpoint) {
        this.amazonS3 = amazonS3;
        this.bucketName = bucketName;
        this.r2Endpoint = r2Endpoint;
    }

    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        String key = String.format("uploads/%s-%s", UUID.randomUUID(), file.getOriginalFilename());
        Path tempDir = Path.of(System.getProperty("java.io.tmpdir"), "uploads");

        try {
            if (Files.notExists(tempDir)) {
                Files.createDirectories(tempDir);
            }

            Path tempFile = tempDir.resolve(key.substring("uploads/".length()));
            file.transferTo(tempFile.toFile());

            amazonS3.putObject(new PutObjectRequest(bucketName, key, tempFile.toFile()));
            ;

            Files.deleteIfExists(tempFile);

            String publicUrl = String.format("https://images.note.rudnam.com/%s", key);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "key", key,
                    "url", publicUrl
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "File upload failed: " + e.getMessage())
            );
        }
    }
}
