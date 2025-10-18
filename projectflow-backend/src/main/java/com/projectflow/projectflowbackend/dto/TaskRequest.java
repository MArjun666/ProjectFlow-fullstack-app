package com.projectflow.projectflowbackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskRequest {
    private String title;
    private String description;
    private String assignedTo;
    private String status;
    private String dueDate;
}