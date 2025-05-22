package com.comparamotors.api_comparamotors.advertisement.application.port.input;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    String saveImage(MultipartFile file) throws IOException;
    void deleteImage(String imageUrl) throws IOException;
}