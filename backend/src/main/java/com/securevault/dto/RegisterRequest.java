package com.securevault.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String loginPassword;
    private String masterPassword;
}
