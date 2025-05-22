package com.comparamotors.api_comparamotors.news.application.port.input;

import java.util.List;
import com.comparamotors.api_comparamotors.news.application.dto.NewsRequestDTO;
import com.comparamotors.api_comparamotors.news.application.dto.NewsResponseDTO;

public interface NewsService {
    NewsResponseDTO createNews(NewsRequestDTO newsRequest);
    NewsResponseDTO updateNews(Long id, NewsRequestDTO newsRequest);
    void deleteNews(Long id);
    NewsResponseDTO getNewsById(Long id);
    List<NewsResponseDTO> getAllNews();
}
