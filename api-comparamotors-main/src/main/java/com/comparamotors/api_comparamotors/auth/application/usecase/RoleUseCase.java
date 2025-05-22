package com.comparamotors.api_comparamotors.auth.application.usecase;

import org.springframework.stereotype.Service;

import com.comparamotors.api_comparamotors.auth.application.dto.RoleDTO;
import com.comparamotors.api_comparamotors.auth.application.port.input.RoleService;
import com.comparamotors.api_comparamotors.auth.application.port.output.PermissionRepository;
import com.comparamotors.api_comparamotors.auth.application.port.output.RoleRepository;
import com.comparamotors.api_comparamotors.auth.domain.model.Permission;
import com.comparamotors.api_comparamotors.auth.domain.model.Role;
import com.comparamotors.api_comparamotors.auth.infrastructure.adapter.mapping.RoleMapper;

import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleUseCase implements RoleService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RoleMapper roleMapper;

    @Override
    public RoleDTO createRole(RoleDTO roleDTO) {
        String formattedRoleName = "ROLE_" + roleDTO.getName().toUpperCase();
        
        if (roleRepository.findByName(formattedRoleName).isPresent()) {
            throw new RuntimeException("Role name already exists");
        }

        Role role = roleMapper.toEntity(roleDTO);
        role.setName(formattedRoleName);
        Role savedRole = roleRepository.save(role);
        return roleMapper.toDTO(savedRole);
    }

    @Override
    public RoleDTO updateRole(Long id, RoleDTO roleDTO) {
        Role existingRole = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        String formattedRoleName = "ROLE_" + roleDTO.getName().toUpperCase();

        if (!existingRole.getName().equals(formattedRoleName) && 
            roleRepository.findByName(formattedRoleName).isPresent()) {
            throw new RuntimeException("Role name already exists");
        }

        existingRole.setName(formattedRoleName);
        existingRole.setDescription(roleDTO.getDescription());

        Role savedRole = roleRepository.save(existingRole);
        return roleMapper.toDTO(savedRole);
    }

    @Override
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        if (!role.getUsers().isEmpty()) {
            throw new RuntimeException("Cannot delete role: still assigned to users");
        }

        roleRepository.deleteById(id);
    }

    @Override
    public RoleDTO getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return roleMapper.toDTO(role);
    }

    @Override
    public List<RoleDTO> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return roleMapper.toDTOList(roles);
    }

    @Override
    public void addPermissionToRole(Long roleId, Long permissionId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        role.getPermissions().add(permission);
        roleRepository.save(role);
    }

    @Override
    public void removePermissionFromRole(Long roleId, Long permissionId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        role.getPermissions().remove(permission);
        roleRepository.save(role);
    }
}
