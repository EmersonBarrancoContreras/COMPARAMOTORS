package com.comparamotors.api_comparamotors.auth.application.port.input;

import java.util.List;

import com.comparamotors.api_comparamotors.auth.application.dto.RoleDTO;

public interface RoleService {
    RoleDTO createRole(RoleDTO role);
    RoleDTO updateRole(Long id, RoleDTO role);
    void deleteRole(Long id);
    RoleDTO getRoleById(Long id);
    List<RoleDTO> getAllRoles();
    void addPermissionToRole(Long roleId, Long permissionId);
    void removePermissionFromRole(Long roleId, Long permissionId);
}
