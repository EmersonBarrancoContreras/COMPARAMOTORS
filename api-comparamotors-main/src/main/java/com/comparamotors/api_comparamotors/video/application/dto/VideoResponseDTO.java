package com.comparamotors.api_comparamotors.video.application.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoResponseDTO {
    private String title;
    private String description;
    private String videoId;
    private String videoUrl;
    private String thumbnailUrl;
    private LocalDateTime publishedAt;
}
