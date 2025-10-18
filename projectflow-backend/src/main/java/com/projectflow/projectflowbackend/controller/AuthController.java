package com.projectflow.projectflowbackend.controller;

import com.projectflow.projectflowbackend.domain.User;
import com.projectflow.projectflowbackend.dto.AuthResponse;
import com.projectflow.projectflowbackend.dto.LoginRequest;
import com.projectflow.projectflowbackend.dto.RegisterRequest;
import com.projectflow.projectflowbackend.dto.UserResponse;
import com.projectflow.projectflowbackend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse authResponse = authService.register(registerRequest);
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(new UserResponse(currentUser));
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuthentication(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User is not authenticated"));
        }

        return ResponseEntity.ok(Map.of(
                "email", currentUser.getEmail(),
                "role", currentUser.getRole().name(),
                "authorities", currentUser.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList())));
    }
}