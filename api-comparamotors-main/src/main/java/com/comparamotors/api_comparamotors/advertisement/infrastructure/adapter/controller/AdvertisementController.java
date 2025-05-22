package com.comparamotors.api_comparamotors.advertisement.infrastructure.adapter.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.comparamotors.api_comparamotors.advertisement.application.dto.AdvertisementRequestDTO;
import com.comparamotors.api_comparamotors.advertisement.application.dto.AdvertisementResponseDTO;
import com.comparamotors.api_comparamotors.advertisement.application.port.input.AdvertisementService;
import com.comparamotors.api_comparamotors.advertisement.domain.model.AdvertesimentTag;

import lombok.RequiredArgsConstructor;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/advertisement")
@RequiredArgsConstructor
public class AdvertisementController {
    private final AdvertisementService advertisementService;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdvertisementResponseDTO> createNews(
            @RequestParam("title") String title,
            @RequestParam("tag") AdvertesimentTag tag,
            @RequestParam("content") String content,
            @RequestParam(value = "redirectLink", required = false) String redirectLink,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
    
        // Manejo seguro de imágenes (evita NullPointerException)
        List<MultipartFile> safeImages = (images != null) ? images : Collections.emptyList();
    
        // Validación de máximo de imágenes permitidas
        if (safeImages.size() > 5) {
            return ResponseEntity.badRequest().body(null); // O lanzar una excepción personalizada
        }
    
        AdvertisementRequestDTO request = AdvertisementRequestDTO.builder()
            .title(title)
            .tag(tag)
            .content(content)
            .redirectLink(redirectLink)
            .images(safeImages)
            .build();
    
        return ResponseEntity.status(HttpStatus.CREATED).body(advertisementService.createAdvertisement(request));
    }
    

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdvertisementResponseDTO> updateNews(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("tag") AdvertesimentTag tag,
            @RequestParam("content") String content,
            @RequestParam(value = "redirectLink", required = false) String redirectLink,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
    
        // Evitar NullPointerException asegurando que images no sea null
        List<MultipartFile> safeImages = (images != null) ? images : Collections.emptyList();
    
        AdvertisementRequestDTO request = AdvertisementRequestDTO.builder()
            .title(title)
            .tag(tag)
            .content(content)
            .redirectLink(redirectLink)
            .images(safeImages)
            .build();
    
        return ResponseEntity.ok(advertisementService.updateAdvertisement(id, request));
    }
    

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdvertisement(@PathVariable Long id) {
        advertisementService.deleteAdvertisement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdvertisementResponseDTO> getAdvertisementById(@PathVariable Long id) {
        return ResponseEntity.ok(advertisementService.getAdvertisementById(id));
    }

    @GetMapping
    public ResponseEntity<List<AdvertisementResponseDTO>> getAllAdvertisements() {
        return ResponseEntity.ok(advertisementService.getAllAdvertisements());
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