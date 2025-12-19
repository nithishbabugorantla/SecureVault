package com.securevault.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ShowPasswordRequest {
    @NotBlank(message = "Master password is required")
    private String masterPassword;
}
