package com.projectflow.projectflowbackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception thrown when a requested resource (e.g., a User, Project, or
 * Task) cannot be found in the database.
 * The @ResponseStatus annotation ensures that if this exception is thrown from
 * a controller, Spring will automatically respond with a 404 NOT_FOUND status
 * code.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Constructs a new ResourceNotFoundException with the specified detail message.
     *
     * @param message the detail message, which is saved for later retrieval by the
     *                getMessage() method.
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}