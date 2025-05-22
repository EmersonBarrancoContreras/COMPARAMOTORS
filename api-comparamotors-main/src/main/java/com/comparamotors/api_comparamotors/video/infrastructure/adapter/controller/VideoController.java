package com.comparamotors.api_comparamotors.video.infrastructure.adapter.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comparamotors.api_comparamotors.video.application.dto.VideoRequestDTO;
import com.comparamotors.api_comparamotors.video.application.dto.VideoResponseDTO;
import com.comparamotors.api_comparamotors.video.application.port.input.VideoService;

@RestController
@RequestMapping("/api/videos")
public class VideoController {
    
    private final VideoService videoService;
    
    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }
    
    @GetMapping
    public ResponseEntity<List<VideoResponseDTO>> getAllVideos() {
        return ResponseEntity.ok(videoService.getAllVideos());
    }
    
    @PostMapping("/sync")
    public ResponseEntity<List<VideoResponseDTO>> syncVideos(@RequestBody VideoRequestDTO request) {
        return ResponseEntity.ok(videoService.syncYoutubeVideos(request));
    }
}