package com.comparamotors.api_comparamotors.auth.infrastructure.adapter;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.comparamotors.api_comparamotors.auth.application.port.output.PermissionRepository;
import com.comparamotors.api_comparamotors.auth.domain.model.Permission;
import com.comparamotors.api_comparamotors.auth.infrastructure.adapter.mapping.PermissionMapper;
import com.comparamotors.api_comparamotors.auth.infrastructure.adapter.repository.JpaPermissionRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PermissionRepositoryAdapter implements PermissionRepository {
    private final JpaPermissionRepository jpaPermissionRepository;
    private final PermissionMapper permissionMapper;

    @Override
    public Permission save(Permission permission) {
        var permissionEntity = permissionMapper.toEntity(permission);
        var savedEntity = jpaPermissionRepository.save(permissionEntity);
        return permissionMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Permission> findById(Long id) {
        return jpaPermissionRepository.findById(id)
                .map(permissionMapper::toDomain);
    }

    @Override
    public Optional<Permission> findByName(String name) {
        return jpaPermissionRepository.findByName(name)
                .map(permissionMapper::toDomain);
    }

    @Override
    public List<Permission> findAll() {
        return permissionMapper.toDomainList(jpaPermissionRepository.findAll());
    }

    @Override
    public void deleteById(Long id) {
        jpaPermissionRepository.deleteById(id);
    }

}
