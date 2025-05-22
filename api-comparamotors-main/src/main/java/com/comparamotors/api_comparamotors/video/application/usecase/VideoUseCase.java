package com.comparamotors.api_comparamotors.video.application.usecase;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.comparamotors.api_comparamotors.video.application.dto.VideoRequestDTO;
import com.comparamotors.api_comparamotors.video.application.dto.VideoResponseDTO;
import com.comparamotors.api_comparamotors.video.application.port.input.VideoService;
import com.comparamotors.api_comparamotors.video.application.port.output.VideoRepository;
import com.comparamotors.api_comparamotors.video.domain.model.Video;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;

@Service
public class VideoUseCase implements VideoService {
    private final VideoRepository videoRepository;
    private final YouTube youTube;

    public VideoUseCase(VideoRepository videoRepository, YouTube youTube) {
        this.videoRepository = videoRepository;
        this.youTube = youTube;
    }

    @Override
    public List<VideoResponseDTO> syncYoutubeVideos(VideoRequestDTO request) {
        try {
            YouTube.Search.List searchRequest = youTube.search()
                    .list(Collections.singletonList("snippet"))
                    .setChannelId(request.getChannelId())
                    .setOrder("date")
                    .setType(Collections.singletonList("video"))
                    .setMaxResults(50L);

            SearchListResponse response = searchRequest.execute();

            return response.getItems().stream()
                    .filter(video -> !videoRepository.existsByVideoId(video.getId().getVideoId()))
                    .map(this::saveVideo)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error syncing YouTube videos", e);
        }
    }

    @Override
    public List<VideoResponseDTO> getAllVideos() {
        return videoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private VideoResponseDTO saveVideo(SearchResult searchResult) {
        String publishedAtStr = searchResult.getSnippet().getPublishedAt().toString();
        LocalDateTime publishedAt = LocalDateTime.parse(publishedAtStr, DateTimeFormatter.ISO_DATE_TIME);

        Video video = new Video(
                searchResult.getSnippet().getTitle(),
                searchResult.getSnippet().getDescription(),
                searchResult.getId().getVideoId(),
                "https://www.youtube.com/watch?v=" + searchResult.getId().getVideoId(),
                searchResult.getSnippet().getThumbnails().getHigh().getUrl(),
                publishedAt);

        Video savedVideo = videoRepository.save(video);
        return mapToDTO(savedVideo);
    }

    private VideoResponseDTO mapToDTO(Video video) {
        return new VideoResponseDTO(
                video.getTitle(),
                video.getDescription(),
                video.getVideoId(),
                video.getVideoUrl(),
                video.getThumbnailUrl(),
                video.getPublishedAt());
    }
}