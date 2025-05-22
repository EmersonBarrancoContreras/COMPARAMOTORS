package com.comparamotors.api_comparamotors.video.application.port.input;

import java.util.List;

import com.comparamotors.api_comparamotors.video.application.dto.VideoRequestDTO;
import com.comparamotors.api_comparamotors.video.application.dto.VideoResponseDTO;

public interface VideoService {
    List<VideoResponseDTO> syncYoutubeVideos(VideoRequestDTO request);
    List<VideoResponseDTO> getAllVideos();
}
