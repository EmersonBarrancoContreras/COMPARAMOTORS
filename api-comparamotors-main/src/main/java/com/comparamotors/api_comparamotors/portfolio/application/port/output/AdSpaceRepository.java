package com.comparamotors.api_comparamotors.portfolio.application.port.output;

import java.util.List;
import java.util.Optional;

import com.comparamotors.api_comparamotors.portfolio.domain.model.AdSpace;

public interface AdSpaceRepository {
    List<AdSpace> findAll();
    Optional<AdSpace> findById(Long id);
    AdSpace save(AdSpace adSpace);
    void deleteById(Long id);
}