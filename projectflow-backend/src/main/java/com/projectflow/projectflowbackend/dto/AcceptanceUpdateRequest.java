package com.projectflow.projectflowbackend.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * A DTO for handling requests to update a task's acceptance status.
 */
@Getter
@Setter
public class AcceptanceUpdateRequest {
    private String acceptanceStatus;
}