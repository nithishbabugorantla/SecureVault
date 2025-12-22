package com.securevault.service;

import com.securevault.dto.AddPasswordRequest;
import com.securevault.dto.DecryptedPasswordResponse;
import com.securevault.dto.PasswordEntryResponse;
import com.securevault.entity.PasswordEntry;
import com.securevault.repository.PasswordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * VaultService - Handles password vault operations
 * 
 * SECURITY LOGIC:
 * 1. All passwords are encrypted with AES-256 before storage
 * 2. Encryption key is derived from master password using PBKDF2
 * 3. Passwords are NEVER stored in plaintext
 * 4. Master password is verified before decryption
 * 5. Only password owner can access their passwords
 * 6. Passwords are masked (********) in list responses
 */
@Service
public class VaultService {
    
    @Autowired
    private PasswordRepository passwordRepository;
    
    @Autowired
    private CryptoService cryptoService;
    
    @Autowired
    private AuthService authService;
    
    /**
     * Retrieves all password entries for a user
     * Passwords are masked for security
     */
    public List<PasswordEntryResponse> getAllPasswords(Long userId) {
        List<PasswordEntry> entries = passwordRepository.findByUserId(userId);
        
        return entries.stream()
                .map(entry -> new PasswordEntryResponse(
                        entry.getId(),
                        entry.getAppName(),
                        entry.getAppUsername(),
                        "********" // Passwords are always masked
                ))
                .collect(Collectors.toList());
    }
    
    /**
     * Adds a new password entry
     * Encrypts password using master PIN before storage
     */
    public PasswordEntryResponse addPassword(Long userId, AddPasswordRequest request) {
        try {
            // Verify master PIN
            if (!authService.verifyMasterPin(userId, request.getMasterPin())) {
                throw new RuntimeException("Invalid master PIN");
            }
            
            // Encrypt password using AES-256 with key derived from master PIN
            String encryptedPassword = cryptoService.encrypt(
                    request.getPassword(), 
                    request.getMasterPin()
            );
            
            // Create and save password entry
            PasswordEntry entry = new PasswordEntry();
            entry.setUserId(userId);
            entry.setAppName(request.getAppName());
            entry.setAppUsername(request.getAppUsername());
            entry.setEncryptedPassword(encryptedPassword);
            entry = passwordRepository.save(entry);
            
            return new PasswordEntryResponse(
                    entry.getId(),
                    entry.getAppName(),
                    entry.getAppUsername(),
                    "********"
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to add password: " + e.getMessage());
        }
    }
    
    /**
     * Shows (decrypts) a password entry
     * CRITICAL: Only decrypts after master PIN verification
     */
    public DecryptedPasswordResponse showPassword(Long userId, Long entryId, String masterPin) {
        try {
            // Verify user ownership
            PasswordEntry entry = passwordRepository.findByIdAndUserId(entryId, userId)
                    .orElseThrow(() -> new RuntimeException("Password entry not found"));
            
            // CRITICAL: Verify master PIN before decryption
            if (!authService.verifyMasterPin(userId, masterPin)) {
                throw new RuntimeException("Invalid master PIN");
            }
            
            // Decrypt password using master PIN
            String decryptedPassword = cryptoService.decrypt(
                    entry.getEncryptedPassword(),
                    masterPin
            );
            
            return new DecryptedPasswordResponse(decryptedPassword);
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt password: " + e.getMessage());
        }
    }
    
    /**
     * Deletes a password entry
     * Validates user ownership before deletion
     */
    public void deletePassword(Long userId, Long entryId) {
        // Verify user ownership
        PasswordEntry entry = passwordRepository.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> new RuntimeException("Password entry not found"));
        
        passwordRepository.delete(entry);
    }
}
