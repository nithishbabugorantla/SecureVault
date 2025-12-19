package com.securevault.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JwtService - Handles JWT token generation and validation
 * 
 * SECURITY NOTE: In production, use a strong secret key from environment variables
 */
@Service
public class JwtService {
    
    private final SecretKey SECRET_KEY;
    private static final long EXPIRATION_TIME = 86400000; // 24 hours
    
    public JwtService(@Value("${jwt.secret:ThisIsADefaultSecretKeyForDevelopmentOnlyPleaseChangeInProduction}") String secret) {
        // Use provided secret or generate one for development
        if (secret.length() < 32) {
            secret = "ThisIsADefaultSecretKeyForDevelopmentOnlyPleaseChangeInProduction";
        }
        this.SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
    
    /**
     * Generates JWT token for authenticated user
     */
    public String generateToken(String username, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }
    
    /**
     * Extracts username from JWT token
     */
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }
    
    /**
     * Extracts user ID from JWT token
     */
    public Long extractUserId(String token) {
        return extractClaims(token).get("userId", Long.class);
    }
    
    /**
     * Validates JWT token
     */
    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
    
    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
}
