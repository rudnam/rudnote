package com.rudnam.note.repository;

import com.rudnam.note.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.rudnam.note.models.Post;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PostRepository extends
        JpaRepository<Post, UUID> {
    Optional<Post> findBySlug(String slug);

    List<Post> findAllByAuthor(User author);

    List<Post> findAllByStatus(Post.Status status);

}
