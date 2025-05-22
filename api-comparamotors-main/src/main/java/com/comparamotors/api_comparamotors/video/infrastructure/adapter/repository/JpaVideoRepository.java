package com.comparamotors.api_comparamotors.video.infrastructure.adapter.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.comparamotors.api_comparamotors.video.application.port.output.VideoRepository;
import com.comparamotors.api_comparamotors.video.domain.model.Video;

@Repository
public interface JpaVideoRepository extends JpaRepository<Video, Long>, VideoRepository {
    boolean existsByVideoId(String videoId);
    List<Video> findAll();
}
