package com.comparamotors.api_comparamotors.video.domain.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@Table(name = "videos")
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @Column(name = "video_id")
    private String videoId;
    @Column(name = "video_url")
    private String videoUrl;
    @Column(name = "thumbnail_url")
    private String thumbnailUrl;
    @Column(name = "published_at")
    private LocalDateTime publishedAt;
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Video(String title, String description, String videoId, 
                 String videoUrl, String thumbnailUrl, LocalDateTime publishedAt) {
        this.title = title;
        this.description = description;
        this.videoId = videoId;
        this.videoUrl = videoUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.publishedAt = publishedAt;
        this.createdAt = LocalDateTime.now();
    }
}
