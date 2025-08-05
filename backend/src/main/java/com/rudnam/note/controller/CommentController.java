package com.rudnam.note.controller;

import com.rudnam.note.models.Comment;
import com.rudnam.note.models.Post;
import com.rudnam.note.models.User;
import com.rudnam.note.repository.CommentRepository;
import com.rudnam.note.repository.PostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts/@{username}/{postId}/comments")
public class CommentController {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentController(CommentRepository commentRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    @GetMapping
    public ResponseEntity<?> getComments(@PathVariable UUID postId) {
        Optional<Post> post = postRepository.findById(postId);
        if (post.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(commentRepository.findAllByPost(post.get()));
    }

    @PostMapping
    public ResponseEntity<?> addComment(
            @PathVariable UUID postId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Content cannot be empty.");
        }

        Comment comment = new Comment();
        comment.setPost(postOpt.get());
        comment.setAuthor(user);
        comment.setContent(content);
        comment.setCreatedAt(Instant.now());

        Comment saved = commentRepository.save(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
