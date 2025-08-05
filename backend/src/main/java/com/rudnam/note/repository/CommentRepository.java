package com.rudnam.note.repository;

import com.rudnam.note.models.Comment;
import com.rudnam.note.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findAllByPost(Post post);
}
