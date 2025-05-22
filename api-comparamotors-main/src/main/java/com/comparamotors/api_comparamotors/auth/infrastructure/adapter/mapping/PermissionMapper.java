package com.comparamotors.api_comparamotors.auth.infrastructure.adapter.mapping;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

import com.comparamotors.api_comparamotors.auth.application.dto.PermissionDTO;
import com.comparamotors.api_comparamotors.auth.domain.model.Permission;

@Component
public class PermissionMapper {

    public PermissionDTO toDTO(Permission permission) {
        if (permission == null)
            return null;

        PermissionDTO dto = new PermissionDTO();
        dto.setId(permission.getId());
        dto.setName(permission.getName());
        dto.setCreatedAt(permission.getCreatedAt());
        dto.setUpdatedAt(permission.getUpdatedAt());
        dto.setDescription(permission.getDescription());
        return dto;
    }

    public Permission toDomain(Permission permission) {
        if (permission == null)
            return null;
        return permission;
    }

    public Permission toDomain(PermissionDTO permissionDTO) {
        if (permissionDTO == null)
            return null;

        Permission permission = new Permission();
        permission.setId(permissionDTO.getId());
        permission.setName(permissionDTO.getName());
        permission.setDescription(permissionDTO.getDescription());
        return permission;
    }

    public Permission toEntity(Permission permission) {
        if (permission == null)
            return null;
        return permission;
    }

    public Set<PermissionDTO> toDTOSet(Set<Permission> permissions) {
        if (permissions == null)
            return null;
        return permissions.stream()
                .map(this::toDTO)
                .collect(Collectors.toSet());
    }

    public List<Permission> toDomainList(List<Permission> permissions) {
        if (permissions == null)
            return null;
        return permissions.stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    public List<PermissionDTO> toDTOList(List<Permission> permissions) {
        if (permissions == null)
            return null;
        return permissions.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}