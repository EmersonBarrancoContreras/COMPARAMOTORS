package com.comparamotors.api_comparamotors.news.application.usecase;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.comparamotors.api_comparamotors.news.application.port.input.FileService;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class cloudinaryUseCaseNews implements FileService {
    
    private final Cloudinary cloudinary;

    @Override
    public String saveImage(MultipartFile file) throws IOException {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> params = ObjectUtils.emptyMap();
            
            @SuppressWarnings("rawtypes")
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            
            log.info("Upload result: {}", uploadResult);
            return (String) uploadResult.get("secure_url");
        } catch (Exception e) {
            log.error("Error detallado: ", e);
            throw new IOException("Error uploading image: " + e.getMessage());
        }
    }

    @Override
    public void deleteImage(String imageUrl) throws IOException {
        if (imageUrl != null && !imageUrl.isEmpty()) {
            try {
                String publicId = extractPublicIdFromUrl(imageUrl);
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            } catch (IOException e) {
                log.error("Error deleting file from Cloudinary", e);
                throw new IOException("Error deleting image: " + e.getMessage());
            }
        }
    }

    private String extractPublicIdFromUrl(String imageUrl) {
        String[] urlParts = imageUrl.split("/");
        String fileName = urlParts[urlParts.length - 1];
        return "news/" + fileName.substring(0, fileName.lastIndexOf('.'));
    }

    @PostConstruct
public void testCloudinaryConnection() {
    try {
        @SuppressWarnings("rawtypes")
        Map result = cloudinary.api().ping(ObjectUtils.emptyMap());
        log.info("Cloudinary connection test successful: {}", result);
    } catch (Exception e) {
        log.error("Failed to connect to Cloudinary: {}", e.getMessage());
    }
}
}