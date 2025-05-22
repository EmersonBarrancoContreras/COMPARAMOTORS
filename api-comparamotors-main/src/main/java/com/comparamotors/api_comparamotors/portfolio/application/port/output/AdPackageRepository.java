package com.comparamotors.api_comparamotors.portfolio.application.port.output;

import java.util.List;
import java.util.Optional;

import com.comparamotors.api_comparamotors.portfolio.domain.model.AdPackage;

public interface AdPackageRepository {
    List<AdPackage> findAll();
    Optional<AdPackage> findById(Long id);
    AdPackage save(AdPackage adPackage);
    void deleteById(Long id);
}
