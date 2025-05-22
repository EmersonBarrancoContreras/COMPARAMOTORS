package com.comparamotors.api_comparamotors.video.application.port.output;

import java.util.List;

import com.comparamotors.api_comparamotors.video.domain.model.Video;

public interface VideoRepository {
    Video save(Video video);
    List<Video> findAll();
    boolean existsByVideoId(String videoId);
}
