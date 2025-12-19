package com.securevault.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * PasswordEntry Entity
 * Stores encrypted password entries for applications
 * - encryptedPassword: AES-256 encrypted password (encrypted using key derived from master password)
 */
@Entity
@Table(name = "password_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String appName;
    
    @Column(nullable = false)
    private String appUsername;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String encryptedPassword;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
