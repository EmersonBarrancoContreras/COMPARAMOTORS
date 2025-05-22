package com.comparamotors.api_comparamotors.portfolio.infrastructure.adapter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.comparamotors.api_comparamotors.portfolio.application.port.output.AdSpaceRepository;
import com.comparamotors.api_comparamotors.portfolio.domain.model.AdSpace;

@Repository
public interface JpaAdSpaceRepository extends JpaRepository<AdSpace, Long>, AdSpaceRepository {
}