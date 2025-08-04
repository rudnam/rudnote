package com.rudnam.note.controller;

import com.rudnam.note.models.Post;
import com.rudnam.note.models.User;
import com.rudnam.note.repository.PostRepository;
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

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping
    public List<Post> getAllPublishedPosts() {
        return postRepository.findAllByStatus(Post.Status.PUBLISHED);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyPosts(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        List<Post> posts = postRepository.findAllByAuthor(currentUser);
        return ResponseEntity.ok(posts);
    }


    @GetMapping("/{slug}")
    public ResponseEntity<?> getPostBySlug(
            @PathVariable String slug,
            @AuthenticationPrincipal User currentUser) {

        Optional<Post> optionalPost = postRepository.findBySlug(slug);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post post = optionalPost.get();

        if (post.getStatus() != Post.Status.PUBLISHED) {
            if (currentUser == null || !post.getAuthor().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to view this draft.");
            }
        }

        return ResponseEntity.ok(post);
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post newPost, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        newPost.setTitle(newPost.getTitle());
        newPost.setContent(newPost.getContent());
        newPost.setSlug(newPost.getSlug());
        newPost.setAuthor(user);
        if (newPost.getStatus() == Post.Status.PUBLISHED) {
            newPost.setStatus(Post.Status.PUBLISHED);
            newPost.setPublishedAt(Instant.now());
        } else {
            newPost.setStatus(Post.Status.DRAFT);
        }
        newPost.setCreatedAt(Instant.now());
        newPost.setUpdatedAt(Instant.now());

        Post saved = postRepository.save(newPost);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable UUID id,
            @RequestBody Post updatedPost,
            @AuthenticationPrincipal User currentUser) {

        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post post = optionalPost.get();

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not the author of this post.");
        }

        post.setTitle(updatedPost.getTitle());
        post.setSlug(updatedPost.getSlug());
        post.setContent(updatedPost.getContent());
        if (updatedPost.getStatus() == Post.Status.PUBLISHED) {
            post.setStatus(Post.Status.PUBLISHED);
            post.setPublishedAt(Instant.now());
        } else {
            post.setStatus(Post.Status.DRAFT);
        }
        postRepository.save(post);

        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {

        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post post = optionalPost.get();

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not the author of this post.");
        }

        postRepository.delete(post);
        return ResponseEntity.noContent().build();
    }


}
