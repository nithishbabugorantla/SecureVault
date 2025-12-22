package com.securevault.controller;

import com.securevault.dto.AuthResponse;
import com.securevault.dto.LoginRequest;
import com.securevault.dto.RegisterRequest;
import com.securevault.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController - Handles authentication endpoints
 * Public endpoints for registration and login
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "${cors.allowed-origins:}"})
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * POST /auth/register
     * Registers a new user with login password and master password
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed");
        }
    }
    
    /**
     * POST /auth/login
     * Authenticates user with login password and returns JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Authentication failed");
        }
    }

    /**
     * Handle validation errors and return detailed error messages
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // Collect all validation errors
        StringBuilder errorMessage = new StringBuilder();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String message = error.getDefaultMessage();
            if (errorMessage.length() > 0) {
                errorMessage.append(". ");
            }
            errorMessage.append(message);
        });
        
        return ResponseEntity.badRequest().body(errorMessage.toString());
    }
}
