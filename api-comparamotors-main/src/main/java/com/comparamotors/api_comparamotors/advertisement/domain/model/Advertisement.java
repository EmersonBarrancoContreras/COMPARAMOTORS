package com.comparamotors.api_comparamotors.advertisement.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "advertisements")
@Getter
@Setter
@NoArgsConstructor
public class Advertisement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;
 
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdvertesimentTag tag;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "redirect_link")
    private String redirectLink;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @OneToMany(mappedBy = "advertisement", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AdvertisementImage> images = new ArrayList<>();

    public Advertisement(String title,AdvertesimentTag tag, String content, String redirectLink) {
        this.title = title;
        this.tag = tag;
        this.content = content;
        this.redirectLink = redirectLink;
        this.publishedAt = LocalDateTime.now();
    }

    public void addImage(AdvertisementImage image) {
        if (images.size() >= 5) {
            throw new IllegalStateException("No se pueden cargar mas de 5 imagenes");
        }
        images.add(image);
        image.setAdvertisement(this);
    }

    public void removeImage(AdvertisementImage image) {
        images.remove(image);
        image.setAdvertisement(null);
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