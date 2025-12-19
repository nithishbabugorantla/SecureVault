package com.securevault.service;

import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.Base64;

/**
 * CryptoService - Handles all cryptographic operations
 * 
 * SECURITY LOGIC:
 * 1. Uses PBKDF2 to derive encryption key from master password
 * 2. Uses AES-256-CBC for encrypting/decrypting stored passwords
 * 3. Each encrypted password has unique IV (Initialization Vector)
 * 4. Format: IV (16 bytes) + Salt (16 bytes) + Encrypted Data
 * 5. Never stores encryption keys or plaintext passwords
 */
@Service
public class CryptoService {
    
    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";
    private static final String KEY_ALGORITHM = "AES";
    private static final int KEY_LENGTH = 256;
    private static final int ITERATION_COUNT = 65536;
    private static final int SALT_LENGTH = 16;
    private static final int IV_LENGTH = 16;
    
    /**
     * Encrypts a password using AES-256
     * Derives encryption key from master password using PBKDF2
     * 
     * @param plaintext The password to encrypt
     * @param masterPassword The master password to derive encryption key
     * @return Base64 encoded string containing IV + Salt + Encrypted data
     */
    public String encrypt(String plaintext, String masterPassword) throws Exception {
        // Generate random salt for PBKDF2
        byte[] salt = generateSalt();
        
        // Derive encryption key from master password using PBKDF2
        SecretKey key = deriveKey(masterPassword, salt);
        
        // Generate random IV for AES
        byte[] iv = generateIV();
        IvParameterSpec ivSpec = new IvParameterSpec(iv);
        
        // Encrypt the plaintext
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, key, ivSpec);
        byte[] encrypted = cipher.doFinal(plaintext.getBytes());
        
        // Combine IV + Salt + Encrypted data
        byte[] combined = new byte[IV_LENGTH + SALT_LENGTH + encrypted.length];
        System.arraycopy(iv, 0, combined, 0, IV_LENGTH);
        System.arraycopy(salt, 0, combined, IV_LENGTH, SALT_LENGTH);
        System.arraycopy(encrypted, 0, combined, IV_LENGTH + SALT_LENGTH, encrypted.length);
        
        // Return as Base64 encoded string
        return Base64.getEncoder().encodeToString(combined);
    }
    
    /**
     * Decrypts an encrypted password using AES-256
     * Derives encryption key from master password using PBKDF2
     * 
     * @param encryptedData Base64 encoded string containing IV + Salt + Encrypted data
     * @param masterPassword The master password to derive encryption key
     * @return Decrypted plaintext password
     */
    public String decrypt(String encryptedData, String masterPassword) throws Exception {
        // Decode from Base64
        byte[] combined = Base64.getDecoder().decode(encryptedData);
        
        // Extract IV, Salt, and Encrypted data
        byte[] iv = new byte[IV_LENGTH];
        byte[] salt = new byte[SALT_LENGTH];
        byte[] encrypted = new byte[combined.length - IV_LENGTH - SALT_LENGTH];
        
        System.arraycopy(combined, 0, iv, 0, IV_LENGTH);
        System.arraycopy(combined, IV_LENGTH, salt, 0, SALT_LENGTH);
        System.arraycopy(combined, IV_LENGTH + SALT_LENGTH, encrypted, 0, encrypted.length);
        
        // Derive encryption key from master password using PBKDF2
        SecretKey key = deriveKey(masterPassword, salt);
        
        // Decrypt the data
        IvParameterSpec ivSpec = new IvParameterSpec(iv);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, key, ivSpec);
        byte[] decrypted = cipher.doFinal(encrypted);
        
        return new String(decrypted);
    }
    
    /**
     * Derives encryption key from master password using PBKDF2
     * Uses 65536 iterations for security
     */
    private SecretKey deriveKey(String masterPassword, byte[] salt) throws Exception {
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        KeySpec spec = new PBEKeySpec(masterPassword.toCharArray(), salt, ITERATION_COUNT, KEY_LENGTH);
        SecretKey tmp = factory.generateSecret(spec);
        return new SecretKeySpec(tmp.getEncoded(), KEY_ALGORITHM);
    }
    
    /**
     * Generates random salt for PBKDF2
     */
    private byte[] generateSalt() {
        byte[] salt = new byte[SALT_LENGTH];
        new SecureRandom().nextBytes(salt);
        return salt;
    }
    
    /**
     * Generates random IV for AES
     */
    private byte[] generateIV() {
        byte[] iv = new byte[IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        return iv;
    }
}
