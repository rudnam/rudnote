package com.rudnam.note.service;

import com.amazonaws.services.s3.AmazonS3;
import com.rudnam.note.models.Image;
import com.rudnam.note.models.Post;
import com.rudnam.note.repository.ImageRepository;
import com.rudnam.note.repository.PostRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final ImageRepository imageRepository;
    private final AmazonS3 amazonS3;

    @Value("${r2.bucket}")
    private String r2Bucket;

    public PostService(PostRepository postRepository, ImageRepository imageRepository, AmazonS3 amazonS3) {
        this.postRepository = postRepository;
        this.imageRepository = imageRepository;
        this.amazonS3 = amazonS3;
    }

    @Transactional
    public Post savePostWithImages(Post post) {
        Post saved = postRepository.save(post);
        imageRepository.deleteAllByPost(saved);
        List<String> keys = extractImageKeys(post.getContent());
        for (String key : keys) {
            Image img = new Image();
            img.setKey(key);
            img.setUrl("https://images.note.rudnam.com/" + key);
            img.setPost(saved);
            img.setCreatedAt(Instant.now());
            imageRepository.save(img);
        }
        return saved;
    }

    private static final Pattern MARKDOWN_IMAGE_PATTERN =
            Pattern.compile("!\\[[^\\]]*\\]\\(([^)\"\\s]+)(?:\\s+\"[^\"]*\")?\\)");

    private List<String> extractImageKeys(String markdown) {
        if (markdown == null || markdown.isEmpty()) {
            return new ArrayList<>();
        }

        Matcher matcher = MARKDOWN_IMAGE_PATTERN.matcher(markdown);
        List<String> keys = new ArrayList<>();

        String customDomainPrefix = "https://images.note.rudnam.com/";

        while (matcher.find()) {
            String url = matcher.group(1).trim();
            String key = url.substring(customDomainPrefix.length());

            keys.add(key);
        }
        return keys;
    }

    public void deletePostWithImages(Post post) {
        List<Image> images = imageRepository.findAllByPost(post);
        for (Image image : images) {
            try {
                amazonS3.deleteObject(r2Bucket, image.getKey());
            } catch (Exception e) {
                System.err.println("Failed to delete S3 object: " + image.getKey() + " - " + e.getMessage());
            }
        }
        imageRepository.deleteAll(images);

        postRepository.delete(post);
    }
}
