package com.comparamotors.api_comparamotors.config;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.youtube.YouTube;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.security.GeneralSecurityException;

@Configuration
public class YouTubeConfig {
    
    @Value("${youtube.api.key}")
    private String apiKey;
    
    @Bean
    public YouTube youTube() throws GeneralSecurityException, IOException {
        
        final NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        final JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
        
        return new YouTube.Builder(httpTransport, jsonFactory, request -> {
                request.getUrl().set("key", apiKey);
            })
            .setApplicationName("ComparaMotors")
            .build();
    }
}