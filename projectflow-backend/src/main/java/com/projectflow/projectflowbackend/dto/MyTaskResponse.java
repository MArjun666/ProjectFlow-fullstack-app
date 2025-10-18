package com.projectflow.projectflowbackend.dto;

import com.projectflow.projectflowbackend.domain.Task;
import lombok.Getter;
import lombok.Setter;

/**
 * A specialized Data Transfer Object (DTO) for the "/mytasks" endpoint.
 *
 * It inherits all the properties and null-safe logic from the base TaskResponse
 * and enriches it with additional information about the project that the task
 * belongs to.
 */
@Getter
@Setter
public class MyTaskResponse extends TaskResponse {

    private String projectName;
    private String projectId;

    /**
     * Constructs a response for the "/mytasks" endpoint.
     *
     * @param task        The Task entity from the database.
     * @param projectName The name of the project this task belongs to.
     * @param projectId   The ID of the project this task belongs to.
     */
    public MyTaskResponse(Task task, String projectName, String projectId) {
        // First, call the constructor of the parent class (TaskResponse)
        // to populate all the standard task fields with null-safety.
        super(task);

        // Then, set the additional fields specific to this DTO.
        this.projectName = projectName;
        this.projectId = projectId;
    }
}