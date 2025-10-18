package com.projectflow.projectflowbackend.repository;

import com.projectflow.projectflowbackend.domain.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Finds a user by their unique email address.
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks if a user with the given email address already exists.
     */
    Boolean existsByEmail(String email);

    /**
     * Finds all users, with sorting applied.
     */
    List<User> findAll(Sort sort);
}