package com.securevault.constants;

/**
 * ValidationConstants - Centralized validation patterns and constants
 * 
 * This class contains all validation rules and patterns used across the application
 * to ensure consistency between frontend and backend validation.
 */
public class ValidationConstants {
    
    /**
     * Password validation pattern (for login password only)
     * Requirements:
     * - At least one lowercase letter [a-z]
     * - At least one uppercase letter [A-Z]
     * - At least one digit [0-9]
     * - At least one special character from the set: !@#$%^&*()_+-=[]{};':"\\|,.<>/?
     * - Minimum length is enforced separately via @Size annotation
     * 
     * Regex breakdown:
     * ^                      - Start of string
     * (?=.*[a-z])           - Positive lookahead: must contain at least one lowercase letter
     * (?=.*[A-Z])           - Positive lookahead: must contain at least one uppercase letter
     * (?=.*\\d)             - Positive lookahead: must contain at least one digit
     * (?=.*[!@#$...])       - Positive lookahead: must contain at least one special character
     * .*                     - Match any characters
     * $                      - End of string
     */
    public static final String PASSWORD_PATTERN = 
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).*$";
    
    /**
     * PIN validation pattern (for master PIN)
     * Requirements:
     * - Exactly 4 digits [0-9]
     */
    public static final String PIN_PATTERN = "^\\d{4}$";
    
    /**
     * Password validation error message
     */
    public static final String PASSWORD_VALIDATION_MESSAGE = 
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    
    /**
     * PIN validation error message
     */
    public static final String PIN_VALIDATION_MESSAGE = 
        "PIN must be exactly 4 digits";
    
    /**
     * Minimum password length
     */
    public static final int PASSWORD_MIN_LENGTH = 8;
    
    /**
     * Maximum password length
     */
    public static final int PASSWORD_MAX_LENGTH = 128;
    
    /**
     * PIN length (exactly 4 digits)
     */
    public static final int PIN_LENGTH = 4;
    
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
