package com.rudnam.note.dto;

import java.time.Instant;

public record UserPublicDto(
        String username,
        String displayName,
        String bio,
        String avatarUrl,
        String websiteUrl,
        String location,
        Instant createdAt
) {}
