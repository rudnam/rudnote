package com.rudnam.note.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record PostRequest(
        @NotBlank String title,
        @NotBlank String slug,
        String summary,
        String content,
        String status,
        List<String> imageKeys
) {}
