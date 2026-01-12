package com.projectflow.projectflowbackend.service;

import com.projectflow.projectflowbackend.domain.User;
import com.projectflow.projectflowbackend.domain.UserRole;
import com.projectflow.projectflowbackend.dto.AuthResponse;
import com.projectflow.projectflowbackend.dto.LoginRequest;
import com.projectflow.projectflowbackend.dto.RegisterRequest;
import com.projectflow.projectflowbackend.exception.ResourceNotFoundException;
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

import java.util.Arrays; // Required for Arrays.asList

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    /**
     * Authenticates a user based on their login credentials.
     * If successful, it generates and returns a JWT along with user details.
     *
     * @param loginRequest DTO containing the user's email and password.
     * @return An AuthResponse DTO containing the JWT and user information.
     * @throws BadCredentialsException if credentials are invalid.
     */
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password.")); // More user-friendly
                                                                                               // error

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name(),
                user.getAvatar());
    }

    /**
     * Registers a new user in the system.
     * After successful registration, it automatically logs the new user in.
     *
     * @param registerRequest DTO containing the new user's details.
     * @return An AuthResponse DTO containing the JWT and the new user's
     *         information.
     * @throws IllegalArgumentException if the email address is already registered.
     */
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email address '" + registerRequest.getEmail() + "' is already in use.");
        }

        UserRole userRole = UserRole.teamMember; // Default role
        String providedRole = registerRequest.getRole();

        if (providedRole != null && !providedRole.isEmpty()) {
            try {
                // Convert the provided role string to the UserRole enum.
                // Ensure the frontend sends the role in a format matching the enum names (e.g.,
                // "projectManager").
                userRole = UserRole.valueOf(providedRole);
            } catch (IllegalArgumentException e) {
                // Handle cases where the role string doesn't match any enum value.
                System.err.println("Registration Warning: Invalid role '" + providedRole
                        + "' provided. Defaulting to 'teamMember'. " + e.getMessage());
                // Keep the default role as teamMember
            }
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(userRole); // Set the determined role

        // Set the avatar, ensuring it handles null or empty strings safely.
        user.setAvatar(registerRequest.getAvatar() == null ? "" : registerRequest.getAvatar());

        userRepository.save(user);

        // Automatically log in the user after successful registration
        return login(new LoginRequest(registerRequest.getEmail(), registerRequest.getPassword()));
    }
}