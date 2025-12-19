package com.securevault.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DecryptedPasswordResponse {
    private String password;
}
