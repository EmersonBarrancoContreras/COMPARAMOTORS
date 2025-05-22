package com.comparamotors.api_comparamotors.news.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "news")
@Getter
@Setter
@NoArgsConstructor
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;
 
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NewsTag tag;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "redirect_link")
    private String redirectLink;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @OneToMany(mappedBy = "news", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NewsImage> images = new ArrayList<>();

    public News(String title,NewsTag tag, String content, String redirectLink) {
        this.title = title;
        this.tag = tag;
        this.content = content;
        this.redirectLink = redirectLink;
        this.publishedAt = LocalDateTime.now();
    }

    public void addImage(NewsImage image) {
        if (images.size() >= 5) {
            throw new IllegalStateException("No se pueden cargar mas de 5 imagenes");
        }
        images.add(image);
        image.setNews(this);
    }

    public void removeImage(NewsImage image) {
        images.remove(image);
        image.setNews(null);
    }

    @Column(nullable = false)
    private LocalDateTime updatedAt;


    @PrePersist
    protected void onCreate() {
        publishedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}