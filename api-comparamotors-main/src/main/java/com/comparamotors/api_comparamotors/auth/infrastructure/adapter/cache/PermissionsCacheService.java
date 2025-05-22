package com.comparamotors.api_comparamotors.auth.infrastructure.adapter.cache;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import com.comparamotors.api_comparamotors.auth.application.port.output.RoleRepository;
import com.comparamotors.api_comparamotors.auth.domain.model.Role;

@Service
public class PermissionsCacheService {
    
    @Autowired
    private RoleRepository roleRepository;
    
    private final Cache<String, Collection<GrantedAuthority>> rolePermissionsCache;
    
    public PermissionsCacheService() {
        this.rolePermissionsCache = Caffeine.newBuilder()
            .expireAfterWrite(1, TimeUnit.HOURS)
            .maximumSize(100)
            .build();
    }
    
    public Collection<GrantedAuthority> getPermissionsForRole(String role) {
        return rolePermissionsCache.get(role, this::loadPermissionsFromDB);
    }
    
    private Collection<GrantedAuthority> loadPermissionsFromDB(String roleName) {
        Role role = roleRepository.findByName(roleName)
            .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
            
        Collection<GrantedAuthority> authorities = role.getPermissions().stream()
            .map(permission -> new SimpleGrantedAuthority(permission.getName()))
            .collect(Collectors.toList());
            
        // Agregar el rol mismo como una autoridad
        authorities.add(new SimpleGrantedAuthority(roleName));
        
        return authorities;
    }

    public void evictAllCache() {
        rolePermissionsCache.invalidateAll();
    }
    
    public void evictCache(String role) {
        rolePermissionsCache.invalidateAll(); // Invalidamos todo el caché por seguridad
    }
}
