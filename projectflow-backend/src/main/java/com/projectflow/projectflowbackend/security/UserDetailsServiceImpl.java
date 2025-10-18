package com.projectflow.projectflowbackend.security;

import com.projectflow.projectflowbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Loads a user by their identifier. The JWT filter provides the user's ID,
     * while the login process provides the user's email. This method handles both
     * cases.
     *
     * @param usernameOrId Can be either the user's email or their MongoDB ID
     *                     string.
     * @return UserDetails object (our User domain class)
     * @throws UsernameNotFoundException if no user is found with the given
     *                                   identifier.
     */
    @Override
    public UserDetails loadUserByUsername(String usernameOrId) throws UsernameNotFoundException {
        // First, try to find the user by email (for login)
        // If not found, try to find by ID (for JWT validation)
        return userRepository.findByEmail(usernameOrId)
                .or(() -> userRepository.findById(usernameOrId))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier: " + usernameOrId));
    }
}