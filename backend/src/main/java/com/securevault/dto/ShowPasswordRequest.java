package com.securevault.dto;

import com.securevault.constants.ValidationConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ShowPasswordRequest {
    @NotBlank(message = "Master PIN is required")
    @Pattern(regexp = ValidationConstants.PIN_PATTERN,
             message = ValidationConstants.PIN_VALIDATION_MESSAGE)
    private String masterPin;
}
