package com.projectflow.projectflowbackend.dto;

import com.projectflow.projectflowbackend.domain.Task;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class TaskResponse {
    private String _id;
    private String title;
    private String description;
    private UserResponse assignedTo;
    private String status;
    private String acceptanceStatus;
    private LocalDate dueDate;

    public TaskResponse(Task task) {
        this._id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();

        if (task.getAssignedTo() != null) {
            this.assignedTo = new UserResponse(task.getAssignedTo());
        }

        if (task.getStatus() != null) {
            this.status = task.getStatus().name().replace("_", " ");
        } else {
            this.status = "N/A";
        }

        if (task.getAcceptanceStatus() != null) {
            this.acceptanceStatus = task.getAcceptanceStatus().name();
        } else {
            this.acceptanceStatus = "N/A";
        }

        this.dueDate = task.getDueDate();
    }
}