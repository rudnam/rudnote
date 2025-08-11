package com.rudnam.note.controller;

import com.rudnam.note.dto.PostRequest;
import com.rudnam.note.dto.PostResponse;
import com.rudnam.note.dto.UserPublicDto;
import com.rudnam.note.models.Image;
import com.rudnam.note.models.Post;
import com.rudnam.note.models.User;
import com.rudnam.note.repository.ImageRepository;
import com.rudnam.note.repository.PostRepository;
import com.rudnam.note.service.PostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepository;
    private final ImageRepository imageRepository;
    private final PostService postService;


    public PostController(PostRepository postRepository, ImageRepository imageRepository, PostService postService) {
        this.postRepository = postRepository;
        this.imageRepository = imageRepository;
        this.postService = postService;
    }

    @GetMapping
    public Page<PostResponse> getAllPublishedPosts(Pageable pageable) {
        return postRepository.findAllByStatus(Post.Status.PUBLISHED, pageable)
                .map(this::toPostResponse);
    }

    @GetMapping("/@{username}")
    public Page<PostResponse> getPublishedPostsByUser(@PathVariable String username, Pageable pageable) {
        return postRepository.findAllByAuthor_UsernameAndStatus(username, Post.Status.PUBLISHED, pageable)
                .map(this::toPostResponse);
    }

    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody PostRequest dto, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        Post newPost = new Post();
        newPost.setTitle(dto.title());
        newPost.setSummary(dto.summary());
        newPost.setContent(dto.content());
        newPost.setSlug(dto.slug());
        newPost.setAuthor(user);
        if ("PUBLISHED".equalsIgnoreCase(dto.status())) {
            newPost.setStatus(Post.Status.PUBLISHED);
            newPost.setPublishedAt(Instant.now());
        } else {
            newPost.setStatus(Post.Status.DRAFT);
        }
        newPost.setCreatedAt(Instant.now());
        newPost.setUpdatedAt(Instant.now());

        Post saved = postService.savePostWithImages(newPost);

        return ResponseEntity.status(HttpStatus.CREATED).body(toPostResponse(saved));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyPosts(@AuthenticationPrincipal User currentUser, Pageable pageable) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }
        Page<PostResponse> myPosts = postRepository.findAllByAuthor(currentUser, pageable)
                .map(this::toPostResponse);
        return ResponseEntity.ok(myPosts);
    }

    @GetMapping("/@{username}/{slug}")
    public ResponseEntity<?> getPostByUsernameAndSlug(
            @PathVariable String username,
            @PathVariable String slug,
            @AuthenticationPrincipal User currentUser) {

        Optional<Post> optionalPost = postRepository.findByAuthor_UsernameAndSlug(username, slug);

        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post post = optionalPost.get();

        if (post.getStatus() != Post.Status.PUBLISHED) {
            if (currentUser == null || !post.getAuthor().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to view this draft.");
            }
        }

        return ResponseEntity.ok(toPostResponse(post));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable UUID id,
            @Valid @RequestBody PostRequest dto,
            @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post post = optionalPost.get();

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not the author of this post.");
        }

        post.setTitle(dto.title());
        post.setSlug(dto.slug());
        post.setSummary(dto.summary());
        post.setContent(dto.content());
        if ("PUBLISHED".equalsIgnoreCase(dto.status())) {
            post.setStatus(Post.Status.PUBLISHED);
            post.setPublishedAt(Instant.now());
        } else {
            post.setStatus(Post.Status.DRAFT);
        }
        post.setUpdatedAt(Instant.now());

        Post saved = postService.savePostWithImages(post);

        return ResponseEntity.ok(toPostResponse(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post post = optionalPost.get();

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not the author of this post.");
        }

        postService.deletePostWithImages(post);

        return ResponseEntity.noContent().build();
    }

    private PostResponse toPostResponse(Post post) {
        UserPublicDto authorDto = new UserPublicDto(
                post.getAuthor().getUsername(),
                post.getAuthor().getDisplayName(),
                post.getAuthor().getBio(),
                post.getAuthor().getAvatarUrl(),
                post.getAuthor().getWebsiteUrl(),
                post.getAuthor().getLocation(),
                post.getAuthor().getCreatedAt()
        );

        List<Image> images = imageRepository.findAllByPost(post);
        List<String> imageUrls = images.stream().map(Image::getUrl).toList();

        return new PostResponse(
                post.getId().toString(),
                post.getTitle(),
                post.getSlug(),
                post.getSummary(),
                post.getContent(),
                post.getStatus().name(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getPublishedAt(),
                authorDto,
                imageUrls
        );
    }
}