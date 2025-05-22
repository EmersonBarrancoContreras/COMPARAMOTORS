package com.comparamotors.api_comparamotors.news.application.port.input;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface FileService {
    String saveImage(MultipartFile file) throws IOException;
    void deleteImage(String imageUrl) throws IOException;
}