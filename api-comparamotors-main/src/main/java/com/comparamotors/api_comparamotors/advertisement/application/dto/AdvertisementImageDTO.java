package com.comparamotors.api_comparamotors.advertisement.application.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdvertisementImageDTO {
    private Long id;
    private String imageUrl;
}