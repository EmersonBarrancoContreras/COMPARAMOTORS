package com.comparamotors.api_comparamotors.advertisement.domain.exception;

public class AdvertisementNotFoundException extends RuntimeException {
    public AdvertisementNotFoundException(Long id) {
        super("No se encontró la noticia con ID: " + id);
    }
}