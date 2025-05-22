package com.comparamotors.api_comparamotors.portfolio.application.port.output;

import java.util.List;
import java.util.Optional;

import com.comparamotors.api_comparamotors.portfolio.domain.model.AdSales;

public interface AdSalesRepository {
    List<AdSales> findAll();
    Optional<AdSales> findById(Long id);
    AdSales save(AdSales adSales);
    void deleteById(Long id);
    List<AdSales> findByUserId(Long userId);
}