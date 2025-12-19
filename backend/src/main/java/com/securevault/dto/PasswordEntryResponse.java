package com.securevault.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordEntryResponse {
    private Long id;
    private String appName;
    private String appUsername;
    private String maskedPassword;
}
