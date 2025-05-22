package com.comparamotors.api_comparamotors.auth.application.dto;

import java.time.LocalDateTime;
import java.util.Set;
import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String username;
    private String name;
    private String lastName;
    private String phoneNumber;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<RoleDTO> roles;
}