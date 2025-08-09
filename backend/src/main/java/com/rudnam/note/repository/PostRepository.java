package com.rudnam.note.repository;

import com.rudnam.note.models.Post;
import com.rudnam.note.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
    Page<Post> findAllByAuthor(User author, Pageable pageable);

    Page<Post> findAllByStatus(Post.Status status, Pageable pageable);
    Page<Post> findAllByAuthor_UsernameAndStatus(String username, Post.Status status, Pageable pageable);
    Optional<Post> findByAuthor_UsernameAndSlug(String username, String slug);

}
