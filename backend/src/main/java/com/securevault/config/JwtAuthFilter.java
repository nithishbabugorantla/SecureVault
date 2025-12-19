package com.securevault.config;

import com.securevault.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * JwtAuthFilter - Intercepts requests and validates JWT tokens
 * Extracts user information from token and sets authentication context
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtService jwtService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // Extract Authorization header
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                // Extract JWT token
                String token = authHeader.substring(7);
                
                // Validate token
                if (jwtService.validateToken(token)) {
                    // Extract username and userId from token
                    String username = jwtService.extractUsername(token);
                    Long userId = jwtService.extractUserId(token);
                    
                    // Set authentication in security context
                    UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    // Add userId to request attributes for easy access in controllers
                    request.setAttribute("userId", userId);
                }
            } catch (Exception e) {
                // Invalid token - continue without authentication
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
