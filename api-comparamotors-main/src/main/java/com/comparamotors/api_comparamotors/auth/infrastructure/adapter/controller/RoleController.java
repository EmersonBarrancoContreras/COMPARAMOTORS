package com.comparamotors.api_comparamotors.auth.infrastructure.adapter.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.comparamotors.api_comparamotors.auth.application.dto.RoleDTO;
import com.comparamotors.api_comparamotors.auth.application.port.input.RoleService;
import com.comparamotors.api_comparamotors.auth.infrastructure.adapter.cache.PermissionsCacheService;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @Autowired
    private PermissionsCacheService permissionsCacheService;

    @PostMapping
    public ResponseEntity<RoleDTO> createRole(@RequestBody RoleDTO role) {
        return ResponseEntity.ok(roleService.createRole(role));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleDTO> updateRole(@PathVariable Long id, @RequestBody RoleDTO role) {
        return ResponseEntity.ok(roleService.updateRole(id, role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleDTO> getRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }

    @GetMapping
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

@PostMapping("/{roleId}/permissions/{permissionId}")
public ResponseEntity<Void> addPermissionToRole(@PathVariable Long roleId, @PathVariable Long permissionId) {
    roleService.addPermissionToRole(roleId, permissionId);
        
    // Después de agregar el permiso, obtenemos el rol y limpiamos el caché
    RoleDTO role = roleService.getRoleById(roleId);
    permissionsCacheService.evictCache(role.getName());
    
    return ResponseEntity.noContent().build();
}

@DeleteMapping("/{roleId}/permissions/{permissionId}")
public ResponseEntity<Void> removePermissionFromRole(@PathVariable Long roleId, @PathVariable Long permissionId) {
    roleService.removePermissionFromRole(roleId, permissionId);
    
    // Después de remover el permiso, obtenemos el rol y limpiamos el caché
    RoleDTO role = roleService.getRoleById(roleId);
    permissionsCacheService.evictCache(role.getName());
    
    return ResponseEntity.noContent().build();
}

}