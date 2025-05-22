package com.comparamotors.api_comparamotors.news.application.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import com.comparamotors.api_comparamotors.news.domain.model.NewsTag;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
@Builder
public class NewsRequestDTO {
    @NotBlank(message = "El título es obligatorio")
    @Size(min = 3, max = 255, message = "El título debe tener entre 3 y 255 caracteres")
    private String title;

    private NewsTag tag;

    @NotBlank(message = "El contenido es obligatorio")
    @Size(min = 10, message = "El contenido debe tener al menos 10 caracteres")
    private String content;

    private String redirectLink;

    @Size(max = 5, message = "No se pueden cargar más de 5 imágenes")
    private List<MultipartFile> images;
}