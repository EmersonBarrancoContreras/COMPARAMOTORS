package com.comparamotors.api_comparamotors.news.application.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class NewsImageDTO {
    private Long id;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}