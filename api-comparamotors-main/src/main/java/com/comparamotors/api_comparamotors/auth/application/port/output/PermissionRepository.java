package com.comparamotors.api_comparamotors.auth.application.port.output;

import java.util.List;
import java.util.Optional;

import com.comparamotors.api_comparamotors.auth.domain.model.Permission;

public interface PermissionRepository {
    Permission save(Permission permission);
    Optional<Permission> findById(Long id);
    Optional<Permission> findByName(String name);
    List<Permission> findAll();
    void deleteById(Long id);
}