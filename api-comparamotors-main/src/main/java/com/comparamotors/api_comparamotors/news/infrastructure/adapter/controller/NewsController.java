package com.comparamotors.api_comparamotors.news.infrastructure.adapter.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.comparamotors.api_comparamotors.news.application.dto.*;
import com.comparamotors.api_comparamotors.news.application.port.input.NewsService;
import com.comparamotors.api_comparamotors.news.domain.model.NewsTag;

import lombok.RequiredArgsConstructor;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {
    private final NewsService newsService;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NewsResponseDTO> createNews(
            @RequestParam("title") String title,
            @RequestParam("tag") NewsTag tag,
            @RequestParam("content") String content,
            @RequestParam(value = "redirectLink", required = false) String redirectLink,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
    
        // Manejo seguro de imágenes (evita NullPointerException)
        List<MultipartFile> safeImages = (images != null) ? images : Collections.emptyList();
    
        // Validación de máximo de imágenes permitidas
        if (safeImages.size() > 5) {
            return ResponseEntity.badRequest().body(null); // O lanzar una excepción personalizada
        }
    
        NewsRequestDTO request = NewsRequestDTO.builder()
            .title(title)
            .tag(tag)
            .content(content)
            .redirectLink(redirectLink)
            .images(safeImages)
            .build();
    
        return ResponseEntity.status(HttpStatus.CREATED).body(newsService.createNews(request));
    }
    

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NewsResponseDTO> updateNews(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("tag") NewsTag tag,
            @RequestParam("content") String content,
            @RequestParam(value = "redirectLink", required = false) String redirectLink,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
    
        // Evitar NullPointerException asegurando que images no sea null
        List<MultipartFile> safeImages = (images != null) ? images : Collections.emptyList();
    
        NewsRequestDTO request = NewsRequestDTO.builder()
            .title(title)
            .tag(tag)
            .content(content)
            .redirectLink(redirectLink)
            .images(safeImages)
            .build();
    
        return ResponseEntity.ok(newsService.updateNews(id, request));
    }
    

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsResponseDTO> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    @GetMapping
    public ResponseEntity<List<NewsResponseDTO>> getAllNews() {
        return ResponseEntity.ok(newsService.getAllNews());
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handleIOException(IOException e) {
        return ResponseEntity.badRequest().body("Error processing file: " + e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}