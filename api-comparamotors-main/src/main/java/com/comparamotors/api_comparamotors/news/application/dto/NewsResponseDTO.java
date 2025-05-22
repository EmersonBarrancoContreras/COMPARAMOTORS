package com.comparamotors.api_comparamotors.news.application.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

import com.comparamotors.api_comparamotors.news.domain.model.NewsTag;


@Getter
@Setter
@Builder
public class NewsResponseDTO {
    private Long id;
    private String title;
    private NewsTag tag;
    private String content;
    private String redirectLink;
    private LocalDateTime publishedAt;
    private LocalDateTime updatedAt;
    private List<NewsImageDTO> images;
}