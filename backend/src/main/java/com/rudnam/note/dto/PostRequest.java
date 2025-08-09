package com.rudnam.note.dto;

import jakarta.validation.constraints.NotBlank;

public record PostRequest(
        @NotBlank String title,
        @NotBlank String slug,
        String summary,
        String content,
        String status
) {}
