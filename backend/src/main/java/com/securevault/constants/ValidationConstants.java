package com.securevault.constants;

/**
 * ValidationConstants - Centralized validation patterns and constants
 * 
 * This class contains all validation rules and patterns used across the application
 * to ensure consistency between frontend and backend validation.
 */
public class ValidationConstants {
    
    /**
     * Password validation pattern
     * Requirements:
     * - At least one lowercase letter [a-z]
     * - At least one uppercase letter [A-Z]
     * - At least one digit [0-9]
     * - At least one special character from the set: !@#$%^&*()_+-=[]{};':"\\|,.<>/?
     * - Minimum length is enforced separately via @Size annotation
     */
    public static final String PASSWORD_PATTERN = 
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).*$";
    
    /**
     * Password validation error message
     */
    public static final String PASSWORD_VALIDATION_MESSAGE = 
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    
    /**
     * Minimum password length
     */
    public static final int PASSWORD_MIN_LENGTH = 8;
    
    /**
     * Maximum password length
     */
    public static final int PASSWORD_MAX_LENGTH = 128;
    
    /**
     * Minimum username length
     */
    public static final int USERNAME_MIN_LENGTH = 3;
    
    /**
     * Maximum username length
     */
    public static final int USERNAME_MAX_LENGTH = 50;
    
    private ValidationConstants() {
        // Prevent instantiation
    }
}
