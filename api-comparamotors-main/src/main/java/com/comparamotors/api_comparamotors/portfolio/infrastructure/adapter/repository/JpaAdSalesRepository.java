package com.comparamotors.api_comparamotors.portfolio.infrastructure.adapter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.comparamotors.api_comparamotors.portfolio.application.port.output.AdSalesRepository;
import com.comparamotors.api_comparamotors.portfolio.domain.model.AdSales;

import java.util.List;

@Repository
public interface JpaAdSalesRepository extends JpaRepository<AdSales, Long>, AdSalesRepository {
    List<AdSales> findByUserId(Long userId);
}
