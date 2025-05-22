package com.comparamotors.api_comparamotors.auth.application.port.input;

import java.util.List;

import com.comparamotors.api_comparamotors.auth.application.dto.PermissionDTO;

public interface PermissionService {
    PermissionDTO createPermission(PermissionDTO permission);
    PermissionDTO updatePermission(Long id, PermissionDTO permission);
    void deletePermission(Long id);
    PermissionDTO getPermissionById(Long id);
    List<PermissionDTO> getAllPermissions();
}