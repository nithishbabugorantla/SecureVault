package com.securevault.controller;

import com.securevault.dto.AddPasswordRequest;
import com.securevault.dto.DecryptedPasswordResponse;
import com.securevault.dto.PasswordEntryResponse;
import com.securevault.dto.ShowPasswordRequest;
import com.securevault.service.VaultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * VaultController - Handles password vault operations
 * All endpoints require JWT authentication
 */
@RestController
@RequestMapping("/vault")
@CrossOrigin(origins = "*")
public class VaultController {
    
    @Autowired
    private VaultService vaultService;
    
    /**
     * GET /vault/passwords
     * Returns all password entries for authenticated user
     * Passwords are masked
     */
    @GetMapping("/passwords")
    public ResponseEntity<List<PasswordEntryResponse>> getAllPasswords(
            @RequestAttribute("userId") Long userId) {
        List<PasswordEntryResponse> passwords = vaultService.getAllPasswords(userId);
        return ResponseEntity.ok(passwords);
    }
    
    /**
     * POST /vault/add
     * Adds a new password entry
     * Requires master password for encryption
     */
    @PostMapping("/add")
    public ResponseEntity<?> addPassword(
            @RequestAttribute("userId") Long userId,
            @RequestBody AddPasswordRequest request) {
        try {
            PasswordEntryResponse response = vaultService.addPassword(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * POST /vault/show/{id}
     * Shows (decrypts) a password entry
     * CRITICAL: Requires master password verification before decryption
     */
    @PostMapping("/show/{id}")
    public ResponseEntity<?> showPassword(
            @RequestAttribute("userId") Long userId,
            @PathVariable Long id,
            @RequestBody ShowPasswordRequest request) {
        try {
            DecryptedPasswordResponse response = vaultService.showPassword(
                    userId, id, request.getMasterPassword());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * DELETE /vault/delete/{id}
     * Deletes a password entry
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePassword(
            @RequestAttribute("userId") Long userId,
            @PathVariable Long id) {
        try {
            vaultService.deletePassword(userId, id);
            return ResponseEntity.ok("Password deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
