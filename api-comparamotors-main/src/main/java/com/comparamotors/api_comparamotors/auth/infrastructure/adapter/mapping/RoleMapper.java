package com.comparamotors.api_comparamotors.auth.infrastructure.adapter.mapping;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.comparamotors.api_comparamotors.auth.application.dto.RoleDTO;
import com.comparamotors.api_comparamotors.auth.domain.model.Role;

@Component
public class RoleMapper {
    
    private final PermissionMapper permissionMapper;

    public RoleMapper(PermissionMapper permissionMapper) {
        this.permissionMapper = permissionMapper;
    }

    public RoleDTO toDTO(Role role) {
        if (role == null) return null;
        
        RoleDTO dto = new RoleDTO();
        dto.setId(role.getId());
        dto.setName(role.getName());
        dto.setDescription(role.getDescription());
        dto.setCreatedAt(role.getCreatedAt());
        dto.setUpdatedAt(role.getUpdatedAt());
        if (role.getPermissions() != null) {
            dto.setPermissions(permissionMapper.toDTOSet(role.getPermissions()));
        }
        return dto;
    }

    public Role toEntity(RoleDTO roleDTO) {
        if (roleDTO == null) return null;
        
        Role entity = new Role();
        entity.setId(roleDTO.getId());
        entity.setName(roleDTO.getName());
        entity.setDescription(roleDTO.getDescription());
        if (roleDTO.getPermissions() != null) {
            entity.setPermissions(roleDTO.getPermissions().stream()
                .map(permissionMapper::toDomain)
                .collect(Collectors.toSet()));
        }
        return entity;
    }

    public Set<RoleDTO> toDTOSet(Set<Role> roles) {
        if (roles == null) return null;
        return roles.stream()
            .map(this::toDTO)
            .collect(Collectors.toSet());
    }

    public List<RoleDTO> toDTOList(List<Role> roles) {
        if (roles == null) return null;
        return roles.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
}