package com.comparamotors.api_comparamotors.auth.application.port.output;

import java.util.List;
import java.util.Optional;

import com.comparamotors.api_comparamotors.auth.domain.model.User;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findAll();
    void deleteById(Long id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
