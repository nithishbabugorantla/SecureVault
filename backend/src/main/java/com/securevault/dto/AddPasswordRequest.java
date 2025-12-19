package com.securevault.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddPasswordRequest {
    @NotBlank(message = "App name is required")
    private String appName;
    
    @NotBlank(message = "App username is required")
    private String appUsername;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @NotBlank(message = "Master password is required")
    private String masterPassword;
}
