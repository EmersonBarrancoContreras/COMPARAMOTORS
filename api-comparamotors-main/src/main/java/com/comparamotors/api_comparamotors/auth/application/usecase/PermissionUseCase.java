package com.comparamotors.api_comparamotors.auth.application.usecase;

import org.springframework.stereotype.Service;

import com.comparamotors.api_comparamotors.auth.application.dto.PermissionDTO;
import com.comparamotors.api_comparamotors.auth.application.port.input.PermissionService;
import com.comparamotors.api_comparamotors.auth.application.port.output.PermissionRepository;
import com.comparamotors.api_comparamotors.auth.domain.model.Permission;
import com.comparamotors.api_comparamotors.auth.infrastructure.adapter.mapping.PermissionMapper;

import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionUseCase implements PermissionService {
    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    @Override
    public PermissionDTO createPermission(PermissionDTO permissionDTO) {
        if (permissionRepository.findByName(permissionDTO.getName()).isPresent()) {
            throw new RuntimeException("Permission name already exists");
        }

        // Primero convertimos el DTO a objeto de dominio
        Permission permission = permissionMapper.toDomain(permissionDTO);
        // Guardamos el objeto de dominio
        Permission savedPermission = permissionRepository.save(permission);
        // Convertimos el resultado a DTO para retornar
        return permissionMapper.toDTO(savedPermission);
    }

    @Override
    public PermissionDTO updatePermission(Long id, PermissionDTO permissionDTO) {
        Permission existingPermission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        if (!existingPermission.getName().equals(permissionDTO.getName()) && 
            permissionRepository.findByName(permissionDTO.getName()).isPresent()) {
            throw new RuntimeException("Permission name already exists");
        }

        existingPermission.setName(permissionDTO.getName());
        existingPermission.setDescription(permissionDTO.getDescription());

        Permission savedPermission = permissionRepository.save(existingPermission);
        return permissionMapper.toDTO(savedPermission);
    }

    @Override
    public void deletePermission(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        if (!permission.getRoles().isEmpty()) {
            throw new RuntimeException("Cannot delete permission: still assigned to roles");
        }

        permissionRepository.deleteById(id);
    }

    @Override
    public PermissionDTO getPermissionById(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));
        return permissionMapper.toDTO(permission);
    }

    @Override
    public List<PermissionDTO> getAllPermissions() {
        List<Permission> permissions = permissionRepository.findAll();
        return permissionMapper.toDTOList(permissions);
    }
}