package com.comparamotors.api_comparamotors.news.application.usecase;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.comparamotors.api_comparamotors.news.application.dto.*;
import com.comparamotors.api_comparamotors.news.application.port.input.FileService;
import com.comparamotors.api_comparamotors.news.application.port.input.NewsService;
import com.comparamotors.api_comparamotors.news.application.port.output.*;
import com.comparamotors.api_comparamotors.news.domain.exception.NewsImageProcessingException;
import com.comparamotors.api_comparamotors.news.domain.exception.NewsNotFoundException;
import com.comparamotors.api_comparamotors.news.domain.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NewsUseCase implements NewsService {
    private final NewsRepository newsRepository;
    private final FileService fileService;

    @Override
    @Transactional
    public NewsResponseDTO createNews(NewsRequestDTO newsRequest) {
        try {
            News news = new News(newsRequest.getTitle(), newsRequest.getTag() ,newsRequest.getContent(), newsRequest.getRedirectLink());
            
            if (newsRequest.getImages() != null && !newsRequest.getImages().isEmpty()) {
                for (MultipartFile file : newsRequest.getImages()) {
                    if (!file.isEmpty()) {
                        String imageUrl = fileService.saveImage(file);
                        news.addImage(new NewsImage(imageUrl));
                    }
                }
            }
            
            News savedNews = newsRepository.save(news);
            return convertToDTO(savedNews);
        } catch (IOException e) {
            log.error("Error processing images for news creation", e);
            throw new NewsImageProcessingException("Error al procesar las imágenes: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public NewsResponseDTO updateNews(Long id, NewsRequestDTO newsRequest) {
        try {
            News news = newsRepository.findById(id)
                .orElseThrow(() -> new NewsNotFoundException(id));
    
            news.setTitle(newsRequest.getTitle());
            news.setTag(newsRequest.getTag());
            news.setContent(newsRequest.getContent());
            news.setRedirectLink(newsRequest.getRedirectLink());
    
            // Si newsRequest.getImages() es null, mantenemos las imágenes existentes
            // Si está vacío, eliminamos todas las imágenes
            // Si tiene nuevas imágenes, reemplazamos las existentes
            if (newsRequest.getImages() != null) {
                // Eliminar imágenes existentes
                for (NewsImage image : news.getImages()) {
                    fileService.deleteImage(image.getImageUrl());
                }
                news.getImages().clear();
    
                // Agregar nuevas imágenes si las hay
                for (MultipartFile file : newsRequest.getImages()) {
                    if (!file.isEmpty()) {
                        String imageUrl = fileService.saveImage(file);
                        news.addImage(new NewsImage(imageUrl));
                    }
                }
            }
    
            News updatedNews = newsRepository.save(news);
            return convertToDTO(updatedNews);
        } catch (IOException e) {
            log.error("Error processing images for news update", e);
            throw new NewsImageProcessingException("Error al procesar las imágenes: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteNews(Long id) {
        News news = newsRepository.findById(id)
            .orElseThrow(() -> new NewsNotFoundException(id));

        // Delete image files
        for (NewsImage image : news.getImages()) {
            try {
                fileService.deleteImage(image.getImageUrl());
            } catch (IOException e) {
                log.error("Error deleting image for news {}: {}", id, image.getImageUrl(), e);
                // Continue with deletion even if image deletion fails
            }
        }

        newsRepository.deleteById(id);
    }

    @Override
    public NewsResponseDTO getNewsById(Long id) {
        return newsRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new NewsNotFoundException(id));
    }

    @Override
    public List<NewsResponseDTO> getAllNews() {
        return newsRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private NewsResponseDTO convertToDTO(News news) {
        return NewsResponseDTO.builder()
            .id(news.getId())
            .title(news.getTitle())
            .tag(news.getTag())
            .content(news.getContent())
            .redirectLink(news.getRedirectLink())
            .publishedAt(news.getPublishedAt())
            .images(news.getImages().stream()
                .map(image -> NewsImageDTO.builder()
                    .id(image.getId())
                    .imageUrl(image.getImageUrl())
                    .build())
                .collect(Collectors.toList()))
            .build();
    }
}