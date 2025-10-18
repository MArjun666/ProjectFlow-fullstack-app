package com.projectflow.projectflowbackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception thrown when a user attempts an action for which they do not
 * have the required authorization (e.g., a team member trying to delete a
 * project).
 * This is used for business logic checks inside your services.
 * The @ResponseStatus annotation ensures that if this exception is thrown from
 * a controller, Spring will automatically respond with a 403 FORBIDDEN status
 * code.
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class UnauthorizedException extends RuntimeException {

    /**
     * Constructs a new UnauthorizedException with the specified detail message.
     *
     * @param message the detail message, which is saved for later retrieval by the
     *                getMessage() method.
     */
    public UnauthorizedException(String message) {
        super(message);
    }
}