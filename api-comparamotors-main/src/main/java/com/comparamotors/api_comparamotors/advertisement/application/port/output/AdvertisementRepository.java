package com.comparamotors.api_comparamotors.advertisement.application.port.output;

import java.util.List;
import java.util.Optional;

import com.comparamotors.api_comparamotors.advertisement.domain.model.Advertisement;


public interface AdvertisementRepository {
    Advertisement save(Advertisement advertisement);
    Optional<Advertisement> findById(Long id);
    List<Advertisement> findAll();
    void deleteById(Long id);
}
