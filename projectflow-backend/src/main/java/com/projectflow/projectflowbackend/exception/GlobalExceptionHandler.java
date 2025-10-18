package com.projectflow.projectflowbackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException; // <-- Important import
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles cases where a resource (like a project or user) is not found.
     * Responds with HTTP 404 NOT_FOUND.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(Map.of("message", ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    /**
     * Handles cases where a user is authenticated but not authorized for a specific
     * action.
     * Responds with HTTP 403 FORBIDDEN.
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<?> handleUnauthorizedException(UnauthorizedException ex, WebRequest request) {
        return new ResponseEntity<>(Map.of("message", ex.getMessage()), HttpStatus.FORBIDDEN);
    }

    /**
     * Handles authorization failures specifically from @PreAuthorize annotations.
     * This is a critical fix for providing clear feedback to the user.
     * Responds with HTTP 403 FORBIDDEN.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        return new ResponseEntity<>(
                Map.of("message", "Access Denied: You do not have the required role for this action."),
                HttpStatus.FORBIDDEN);
    }

    /**
     * A catch-all handler for any other unexpected runtime exceptions.
     * Logs the full error for debugging and returns a generic error message.
     * Responds with HTTP 500 INTERNAL_SERVER_ERROR.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        // It's crucial to log the full exception to the console for debugging
        ex.printStackTrace();
        return new ResponseEntity<>(Map.of("message", "An unexpected internal error occurred: " + ex.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}