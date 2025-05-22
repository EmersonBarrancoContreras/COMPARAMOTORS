package com.comparamotors.api_comparamotors.portfolio.infrastructure.adapter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.comparamotors.api_comparamotors.portfolio.application.port.output.AdPackageRepository;
import com.comparamotors.api_comparamotors.portfolio.domain.model.AdPackage;

@Repository
public interface JpaAdPackageRepository extends JpaRepository<AdPackage, Long>, AdPackageRepository {
}