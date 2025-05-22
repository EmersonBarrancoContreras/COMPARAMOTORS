package com.comparamotors.api_comparamotors.auth.application.port.input;

import java.util.List;

import com.comparamotors.api_comparamotors.auth.application.dto.UserRequestDTO;
import com.comparamotors.api_comparamotors.auth.application.dto.UserResponseDTO;

public interface UserService {
    UserResponseDTO createUser(UserRequestDTO user);
    UserResponseDTO updateUser(Long id, UserRequestDTO user);
    void deleteUser(Long id);
    UserResponseDTO getUserById(Long id);
    UserResponseDTO getUserByUsername(String username);
    List<UserResponseDTO> getAllUsers();
    void addRoleToUser(Long userId, Long roleId);
    void removeRoleFromUser(Long userId, Long roleId);
    UserResponseDTO registerUser(UserRequestDTO user);
}
