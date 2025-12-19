package com.securevault.service;

import com.securevault.dto.AuthResponse;
import com.securevault.dto.LoginRequest;
import com.securevault.dto.RegisterRequest;
import com.securevault.entity.User;
import com.securevault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * AuthService - Handles user registration and authentication
 * 
 * SECURITY LOGIC:
 * 1. Login password is hashed with BCrypt for authentication
 * 2. Master password is hashed with BCrypt for authorization (separate from login)
 * 3. JWT token is generated upon successful login
 * 4. Master password is NEVER stored in plaintext
 * 5. Master password hash is used only for verification, not for encryption
 */
@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    /**
     * Registers a new user
     * Hashes both login password and master password using BCrypt
     */
    public AuthResponse register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Registration failed");
        }
        
        // Hash login password with BCrypt
        String loginPasswordHash = passwordEncoder.encode(request.getLoginPassword());
        
        // Hash master password with BCrypt (separate from login password)
        String masterPasswordHash = passwordEncoder.encode(request.getMasterPassword());
        
        // Create and save user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setLoginPasswordHash(loginPasswordHash);
        user.setMasterPasswordHash(masterPasswordHash);
        user = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getUsername(), user.getId());
        
        return new AuthResponse(token, user.getUsername());
    }
    
    /**
     * Authenticates user with login password
     * Returns JWT token upon successful authentication
     */
    public AuthResponse login(LoginRequest request) {
        // Find user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        
        // Verify login password using BCrypt
        if (!passwordEncoder.matches(request.getLoginPassword(), user.getLoginPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getUsername(), user.getId());
        
        return new AuthResponse(token, user.getUsername());
    }
    
    /**
     * Verifies master password
     * Used before decrypting passwords
     */
    public boolean verifyMasterPassword(Long userId, String masterPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify master password hash using BCrypt
        return passwordEncoder.matches(masterPassword, user.getMasterPasswordHash());
    }
}
