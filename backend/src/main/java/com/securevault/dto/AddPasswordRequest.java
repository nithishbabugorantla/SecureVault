package com.securevault.dto;

import lombok.Data;

@Data
public class AddPasswordRequest {
    private String appName;
    private String appUsername;
    private String password;
    private String masterPassword;
}
