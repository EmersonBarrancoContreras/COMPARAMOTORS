package com.comparamotors.api_comparamotors.news.application.port.output;

import java.util.List;
import java.util.Optional;
import com.comparamotors.api_comparamotors.news.domain.model.News;

public interface NewsRepository {
    News save(News news);
    Optional<News> findById(Long id);
    List<News> findAll();
    void deleteById(Long id);
}