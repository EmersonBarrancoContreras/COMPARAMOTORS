package com.comparamotors.api_comparamotors.auth.application.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PermissionDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}