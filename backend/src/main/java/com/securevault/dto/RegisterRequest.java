package com.securevault.dto;

import com.securevault.constants.ValidationConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(min = ValidationConstants.USERNAME_MIN_LENGTH, 
          max = ValidationConstants.USERNAME_MAX_LENGTH, 
          message = "Username must be between " + ValidationConstants.USERNAME_MIN_LENGTH + 
                    " and " + ValidationConstants.USERNAME_MAX_LENGTH + " characters")
    private String username;
    
    @NotBlank(message = "Login password is required")
    @Size(min = ValidationConstants.PASSWORD_MIN_LENGTH, 
          max = ValidationConstants.PASSWORD_MAX_LENGTH, 
          message = "Login password must be at least " + ValidationConstants.PASSWORD_MIN_LENGTH + " characters")
    @Pattern(regexp = ValidationConstants.PASSWORD_PATTERN,
             message = ValidationConstants.PASSWORD_VALIDATION_MESSAGE)
    private String loginPassword;
    
    @NotBlank(message = "Master password is required")
    @Size(min = ValidationConstants.PASSWORD_MIN_LENGTH, 
          max = ValidationConstants.PASSWORD_MAX_LENGTH, 
          message = "Master password must be at least " + ValidationConstants.PASSWORD_MIN_LENGTH + " characters")
    @Pattern(regexp = ValidationConstants.PASSWORD_PATTERN,
             message = ValidationConstants.PASSWORD_VALIDATION_MESSAGE)
    private String masterPassword;
}
