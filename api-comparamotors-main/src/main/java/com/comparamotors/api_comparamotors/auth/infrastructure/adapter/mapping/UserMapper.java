package com.comparamotors.api_comparamotors.auth.infrastructure.adapter.mapping;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.comparamotors.api_comparamotors.auth.application.dto.UserRequestDTO;
import com.comparamotors.api_comparamotors.auth.application.dto.UserResponseDTO;
import com.comparamotors.api_comparamotors.auth.domain.model.User;

@Component
public class UserMapper {
    
    private final RoleMapper roleMapper;

    public UserMapper(RoleMapper roleMapper) {
        this.roleMapper = roleMapper;
    }

    public User toEntity(UserRequestDTO userRequestDTO) {
        if (userRequestDTO == null) return null;
        
        User entity = new User();
        entity.setEmail(userRequestDTO.getEmail());
        entity.setPassword(userRequestDTO.getPassword());
        entity.setUsername(userRequestDTO.getUsername());
        entity.setName(userRequestDTO.getName());
        entity.setLastName(userRequestDTO.getLastName());
        entity.setPhoneNumber(userRequestDTO.getPhoneNumber());
        return entity;
    }

    public UserResponseDTO toDTO(User user) {
        if (user == null) return null;
        
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setUsername(user.getUsername());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        if (user.getRoles() != null) {
            dto.setRoles(roleMapper.toDTOSet(user.getRoles()));
        }
        return dto;
    }

    public List<UserResponseDTO> toDTOList(List<User> users) {
        if (users == null) return null;
        return users.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public User toDomain(User user) {
        if (user == null) return null;
        return user; // Since it's the same type, we can return it directly
    }

    public User toEntity(User user) {
        if (user == null) return null;
        return user; // Since it's the same type, we can return it directly
    }

    public List<User> toDomainList(List<User> users) {
        if (users == null) return null;
        return users; // Since it's the same type, we can return it directly
    }

    public void updateEntityFromDTO(UserRequestDTO userRequestDTO, User user) {
        if (userRequestDTO == null || user == null) return;
        
        user.setEmail(userRequestDTO.getEmail());
        user.setPassword(userRequestDTO.getPassword());
        user.setUsername(userRequestDTO.getUsername());
        user.setName(userRequestDTO.getName());
        user.setLastName(userRequestDTO.getLastName());
        user.setPhoneNumber(userRequestDTO.getPhoneNumber());
    }
}