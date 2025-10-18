package com.projectflow.projectflowbackend.service;

import com.projectflow.projectflowbackend.domain.User;
import com.projectflow.projectflowbackend.domain.UserRole;
import com.projectflow.projectflowbackend.dto.AuthResponse;
import com.projectflow.projectflowbackend.dto.LoginRequest;
import com.projectflow.projectflowbackend.dto.RegisterRequest;
import com.projectflow.projectflowbackend.repository.UserRepository;
import com.projectflow.projectflowbackend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadCredentialsException("User not found after successful authentication."));

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name(),
                user.getAvatar());
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email address '" + registerRequest.getEmail() + "' is already in use.");
        }

        UserRole userRole;
        try {
            userRole = UserRole.valueOf(registerRequest.getRole().toLowerCase());
        } catch (Exception e) {
            System.err.println("Warning: Invalid role string received during registration: '"
                    + registerRequest.getRole() + "'. Defaulting to 'teamMember'.");
            userRole = UserRole.teamMember;
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(userRole);
        user.setAvatar(registerRequest.getAvatar());

        userRepository.save(user);

        return login(new LoginRequest(registerRequest.getEmail(), registerRequest.getPassword()));
    }
}