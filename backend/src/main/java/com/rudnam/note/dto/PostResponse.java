package com.rudnam.note.dto;

import java.time.Instant;

public record PostResponse(
        String id,
        String title,
        String slug,
        String summary,
        String content,
        String status,
        Instant createdAt,
        Instant updatedAt,
        Instant publishedAt,
        UserPublicDto author
) {}
