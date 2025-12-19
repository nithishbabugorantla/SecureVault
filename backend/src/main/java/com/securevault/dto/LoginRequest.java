package com.securevault.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String loginPassword;
}
