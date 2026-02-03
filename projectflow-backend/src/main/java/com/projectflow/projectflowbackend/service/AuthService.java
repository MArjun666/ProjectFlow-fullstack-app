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

/**
 * Service class responsible for handling all user authentication and
 * registration logic.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    /**
     * Authenticates a user with the provided credentials. If successful, it
     * generates and
     * returns a JWT and the user's details.
     *
     * @param loginRequest DTO containing the user's email and password.
     * @return An {@link AuthResponse} DTO with the JWT and user information.
     * @throws BadCredentialsException if the provided credentials are not valid.
     */
    public AuthResponse login(LoginRequest loginRequest) {
        // The AuthenticationManager securely handles the password verification.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        // Retrieve the full user details to build the response.
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found after successful authentication. This should not happen."));

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name(),
                user.getAvatar());
    }

    /**
     * Registers a new user, saves them to the database, and then automatically logs
     * them in.
     *
     * @param registerRequest DTO containing the details for the new user.
     * @return An {@link AuthResponse} DTO with the JWT and the new user's
     *         information.
     * @throws IllegalArgumentException if the email address is already in use.
     */
    public AuthResponse register(RegisterRequest registerRequest) {
        // Ensure the email is not already registered.
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException(
                    "An account with the email '" + registerRequest.getEmail() + "' already exists.");
        }

        // --- Refined Role Handling ---
        UserRole userRole;
        try {
            // This is a clean way to convert the string from the request to the enum.
            // It requires the frontend to send the exact enum name (e.g.,
            // "projectManager").
            userRole = UserRole.valueOf(registerRequest.getRole());
        } catch (IllegalArgumentException | NullPointerException e) {
            // If the role string is invalid or null, log a warning and default to the most
            // restrictive role.
            System.err.println("Registration Warning: Invalid or null role provided ('" + registerRequest.getRole()
                    + "'). Defaulting to 'teamMember'.");
            userRole = UserRole.teamMember;
        }
        // --- End of Refinement ---

        // Create and configure the new User entity.
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(userRole);
        user.setAvatar(registerRequest.getAvatar() == null ? "" : registerRequest.getAvatar());

        userRepository.save(user);

        // After saving, automatically log in the new user.
        return login(new LoginRequest(registerRequest.getEmail(), registerRequest.getPassword()));
    }
}