package com.comparamotors.api_comparamotors.auth.infrastructure.adapter;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.comparamotors.api_comparamotors.auth.application.port.output.RoleRepository;
import com.comparamotors.api_comparamotors.auth.domain.model.Role;
import com.comparamotors.api_comparamotors.auth.infrastructure.adapter.repository.JpaRoleRepository;

@Component
public class RoleRepositoryAdapter implements RoleRepository {
    
    private final JpaRoleRepository jpaRoleRepository;

    public RoleRepositoryAdapter(JpaRoleRepository jpaRoleRepository) {
        this.jpaRoleRepository = jpaRoleRepository;
    }

    @Override
    public Role save(Role role) {
        return jpaRoleRepository.save(role);
    }

    @Override
    public Optional<Role> findById(Long id) {
        return jpaRoleRepository.findById(id);
    }

    @Override
    public Optional<Role> findByName(String name) {
        return jpaRoleRepository.findByName(name);
    }

    @Override
    public List<Role> findAll() {
        return jpaRoleRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        jpaRoleRepository.deleteById(id);
    }
}