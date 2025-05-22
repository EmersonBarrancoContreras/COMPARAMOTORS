package com.comparamotors.api_comparamotors.auth.infrastructure.adapter.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.comparamotors.api_comparamotors.auth.domain.model.Permission;

@Repository
public interface JpaPermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByName(String name);
}