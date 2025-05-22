package com.comparamotors.api_comparamotors.advertisement.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.comparamotors.api_comparamotors.advertisement.application.dto.AdvertisementImageDTO;
import com.comparamotors.api_comparamotors.advertisement.application.dto.AdvertisementRequestDTO;
import com.comparamotors.api_comparamotors.advertisement.application.dto.AdvertisementResponseDTO;
import com.comparamotors.api_comparamotors.advertisement.application.port.input.AdvertisementService;
import com.comparamotors.api_comparamotors.advertisement.application.port.input.FileService;
import com.comparamotors.api_comparamotors.advertisement.application.port.output.AdvertisementRepository;
import com.comparamotors.api_comparamotors.advertisement.domain.exception.AdvertisementImageProcessingException;
import com.comparamotors.api_comparamotors.advertisement.domain.exception.AdvertisementNotFoundException;
import com.comparamotors.api_comparamotors.advertisement.domain.model.Advertisement;
import com.comparamotors.api_comparamotors.advertisement.domain.model.AdvertisementImage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;



@Slf4j
@Service
@RequiredArgsConstructor
public class AdvertisementUseCase implements AdvertisementService{
    private final AdvertisementRepository advertisementRepository;
    private final FileService fileService;

    @Override
    @Transactional
    public AdvertisementResponseDTO createAdvertisement(AdvertisementRequestDTO advertisementRequest){
        try {
            Advertisement advertisement = new Advertisement(advertisementRequest.getTitle(), advertisementRequest.getTag() ,advertisementRequest.getContent(), advertisementRequest.getRedirectLink());
            
            if (advertisementRequest.getImages() != null && !advertisementRequest.getImages().isEmpty()) {
                for (MultipartFile file : advertisementRequest.getImages()) {
                    if (!file.isEmpty()) {
                        String imageUrl = fileService.saveImage(file);
                        advertisement.addImage(new AdvertisementImage(imageUrl));
                    }
                }
            }
            
            Advertisement savedAdvertisement = advertisementRepository.save(advertisement);
            return convertToDTO(savedAdvertisement);
        } catch (IOException e) {
            log.error("Error processing images for adversiements creation", e);
            throw new AdvertisementImageProcessingException("Error al procesar las imágenes: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public AdvertisementResponseDTO updateAdvertisement(Long id, AdvertisementRequestDTO advertisementRequest) {
        try {
            Advertisement advertisement = advertisementRepository.findById(id)
                .orElseThrow(() -> new AdvertisementNotFoundException(id));
    
                advertisement.setTitle(advertisementRequest.getTitle());
                advertisement.setTag(advertisementRequest.getTag());
                advertisement.setContent(advertisementRequest.getContent());
                advertisement.setRedirectLink(advertisementRequest.getRedirectLink());
    
            // Si newsRequest.getImages() es null, mantenemos las imágenes existentes
            // Si está vacío, eliminamos todas las imágenes
            // Si tiene nuevas imágenes, reemplazamos las existentes
            if (advertisementRequest.getImages() != null) {
                // Eliminar imágenes existentes
                for (AdvertisementImage image : advertisement.getImages()) {
                    fileService.deleteImage(image.getImageUrl());
                }
                advertisement.getImages().clear();
    
                // Agregar nuevas imágenes si las hay
                for (MultipartFile file : advertisementRequest.getImages()) {
                    if (!file.isEmpty()) {
                        String imageUrl = fileService.saveImage(file);
                        advertisement.addImage(new AdvertisementImage(imageUrl));
                    }
                }
            }
    
            Advertisement updatedAdvertisement = advertisementRepository.save(advertisement);
            return convertToDTO(updatedAdvertisement);
        } catch (IOException e) {
            log.error("Error processing images for advertisements update", e);
            throw new AdvertisementImageProcessingException("Error al procesar las imágenes: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteAdvertisement(Long id) {
        Advertisement advertisement = advertisementRepository.findById(id)
            .orElseThrow(() -> new AdvertisementNotFoundException(id));

        // Delete image files
        for (AdvertisementImage image : advertisement.getImages()) {
            try {
                fileService.deleteImage(image.getImageUrl());
            } catch (IOException e) {
                log.error("Error deleting image for advertisements {}: {}", id, image.getImageUrl(), e);
                // Continue with deletion even if image deletion fails
            }
        }

        advertisementRepository.deleteById(id);
    }

    @Override
    public AdvertisementResponseDTO getAdvertisementById(Long id) {
        return advertisementRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new AdvertisementNotFoundException(id));
    }

    @Override
    public List<AdvertisementResponseDTO> getAllAdvertisements() {
        return advertisementRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private AdvertisementResponseDTO convertToDTO(Advertisement advertisement) {
        return AdvertisementResponseDTO.builder()
            .id(advertisement.getId())
            .title(advertisement.getTitle())
            .tag(advertisement.getTag())
            .content(advertisement.getContent())
            .redirectLink(advertisement.getRedirectLink())
            .publishedAt(advertisement.getPublishedAt())
            .images(advertisement.getImages().stream()
                .map(image -> AdvertisementImageDTO.builder()
                    .id(image.getId())
                    .imageUrl(image.getImageUrl())
                    .build())
                .collect(Collectors.toList()))
            .build();
    }
}