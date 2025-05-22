package com.comparamotors.api_comparamotors.news.domain.exception;

public class NewsNotFoundException extends RuntimeException {
    public NewsNotFoundException(Long id) {
        super("No se encontró la noticia con ID: " + id);
    }
}