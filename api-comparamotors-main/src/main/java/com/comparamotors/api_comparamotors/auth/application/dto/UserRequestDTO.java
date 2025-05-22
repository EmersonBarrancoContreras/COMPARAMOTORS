package com.comparamotors.api_comparamotors.auth.application.dto;

import lombok.Data;

@Data
public class UserRequestDTO {
    private String name;
    private String lastName;
    private String username;
    private String phoneNumber;
    private String email;
    private String password;
}
