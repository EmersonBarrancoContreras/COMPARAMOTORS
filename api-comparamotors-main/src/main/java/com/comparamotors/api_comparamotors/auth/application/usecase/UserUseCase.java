package com.comparamotors.api_comparamotors.auth.application.usecase;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.comparamotors.api_comparamotors.auth.application.dto.UserRequestDTO;
import com.comparamotors.api_comparamotors.auth.application.dto.UserResponseDTO;
import com.comparamotors.api_comparamotors.auth.application.port.input.UserService;
import com.comparamotors.api_comparamotors.auth.application.port.output.RoleRepository;
import com.comparamotors.api_comparamotors.auth.application.port.output.UserRepository;
import com.comparamotors.api_comparamotors.auth.domain.model.Role;
import com.comparamotors.api_comparamotors.auth.domain.model.User;
import com.comparamotors.api_comparamotors.auth.infrastructure.adapter.mapping.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserUseCase implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    private static final String DEFAULT_USER_ROLE = "ROLE_USER";

    @Override
    @Transactional
    public UserResponseDTO createUser(UserRequestDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = userMapper.toEntity(userDTO);
        user.setPassword((userDTO.getPassword()));
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }

  @Override
    @Transactional
    public UserResponseDTO registerUser(UserRequestDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = userMapper.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        
        // Guardar el usuario primero para obtener su ID
        User savedUser = userRepository.save(user);
        
        // Obtener el rol de usuario por nombre y asignarlo
        Role userRole = roleRepository.findByName(DEFAULT_USER_ROLE)
                .orElseThrow(() -> new RuntimeException("Default user role not found"));
        
        savedUser.getRoles().add(userRole);
        userRepository.save(savedUser);
        
        return userMapper.toDTO(savedUser);
    }

    @Override
    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userDTO.getUsername() != null &&
                !existingUser.getUsername().equals(userDTO.getUsername()) &&
                userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userDTO.getEmail() != null &&
                !existingUser.getEmail().equals(userDTO.getEmail()) &&
                userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        updateUserFields(existingUser, userDTO);
        User savedUser = userRepository.save(existingUser);
        return userMapper.toDTO(savedUser);
    }

    private void updateUserFields(User existingUser, UserRequestDTO userDTO) {
        if (userDTO.getName() != null) {
            existingUser.setName(userDTO.getName());
        }
        if (userDTO.getLastName() != null) {
            existingUser.setLastName(userDTO.getLastName());
        }
        if (userDTO.getUsername() != null) {
            existingUser.setUsername(userDTO.getUsername());
        }
        if (userDTO.getEmail() != null) {
            existingUser.setEmail(userDTO.getEmail());
        }
        if (userDTO.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(userDTO.getPhoneNumber());
        }
        if (userDTO.getPassword() != null && !userDTO.getPassword().trim().isEmpty()) {
            existingUser.setPassword((userDTO.getPassword()));
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.toDTOList(users);
    }

    @Override
    @Transactional
    public void addRoleToUser(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.getRoles().add(role);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void removeRoleFromUser(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.getRoles().remove(role);
        userRepository.save(user);
    }
}
