package com.comparamotors.api_comparamotors.advertisement.application.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.comparamotors.api_comparamotors.advertisement.domain.model.AdvertesimentTag;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdvertisementResponseDTO {
    private Long id;
    private String title;
    private AdvertesimentTag tag;
    private String content;
    private String redirectLink;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<AdvertisementImageDTO> images;
}
