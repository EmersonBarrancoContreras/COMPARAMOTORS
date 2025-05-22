package com.comparamotors.api_comparamotors.auth.application.port.output;

import java.util.List;
import java.util.Optional;

import com.comparamotors.api_comparamotors.auth.domain.model.Role;

public interface RoleRepository {
    Role save(Role role);
    Optional<Role> findById(Long id);
    Optional<Role> findByName(String name);
    List<Role> findAll();
    void deleteById(Long id);
}