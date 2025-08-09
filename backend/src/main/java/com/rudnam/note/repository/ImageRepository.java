package com.rudnam.note.repository;

import com.rudnam.note.models.Image;
import com.rudnam.note.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ImageRepository extends JpaRepository<Image, UUID> {
    List<Image> findAllByPost(Post post);
}
