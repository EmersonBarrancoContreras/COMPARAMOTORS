package com.comparamotors.api_comparamotors.news.infrastructure.adapter.repository;

import org.springframework.stereotype.Repository;
import com.comparamotors.api_comparamotors.news.application.port.output.NewsRepository;
import com.comparamotors.api_comparamotors.news.domain.model.News;
import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JpaNewsRepository implements NewsRepository {
    private final EntityManager entityManager;

    @Override
    public News save(News news) {
        if (news.getId() == null) {
            entityManager.persist(news);
            return news;
        }
        return entityManager.merge(news);
    }

    @Override
    public Optional<News> findById(Long id) {
        return Optional.ofNullable(entityManager.find(News.class, id));
    }

    @Override
    public List<News> findAll() {
        return entityManager.createQuery("SELECT n FROM News n ORDER BY n.publishedAt DESC", News.class)
            .getResultList();
    }

    @Override
    public void deleteById(Long id) {
        News news = entityManager.find(News.class, id);
        if (news != null) {
            entityManager.remove(news);
        }
    }
}