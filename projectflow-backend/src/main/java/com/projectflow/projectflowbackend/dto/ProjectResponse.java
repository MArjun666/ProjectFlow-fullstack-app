package com.projectflow.projectflowbackend.dto;

import com.projectflow.projectflowbackend.domain.Project;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class ProjectResponse {

    private String _id;
    private String name;
    private String description;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String clientName;
    private String clientEmail;
    private String clientCompany;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse projectManager;
    private List<UserResponse> teamMembers;
    private List<TaskResponse> tasks;
    private int teamMemberCount;
    private int taskCount;
    private int completedTaskCount;
    private int overallCompletionPercentage;

    public ProjectResponse(Project project) {
        this._id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();

        if (project.getStatus() != null) {
            this.status = project.getStatus().name().replace("_", " ");
        } else {
            this.status = "N/A";
        }

        this.startDate = project.getStartDate();
        this.endDate = project.getEndDate();
        this.clientName = project.getClientName();
        this.clientEmail = project.getClientEmail();
        this.clientCompany = project.getClientCompany();
        this.createdAt = project.getCreatedAt();
        this.updatedAt = project.getUpdatedAt();

        if (project.getProjectManager() != null) {
            this.projectManager = new UserResponse(project.getProjectManager());
        }

        if (project.getTeamMembers() != null) {
            this.teamMembers = project.getTeamMembers().stream()
                    .map(UserResponse::new)
                    .collect(Collectors.toList());
        } else {
            this.teamMembers = Collections.emptyList();
        }

        if (project.getTasks() != null) {
            this.tasks = project.getTasks().stream()
                    .map(TaskResponse::new)
                    .collect(Collectors.toList());
        } else {
            this.tasks = Collections.emptyList();
        }

        this.teamMemberCount = this.teamMembers.size();
        this.taskCount = this.tasks.size();

        this.completedTaskCount = (int) this.tasks.stream()
                .filter(task -> "Completed".equalsIgnoreCase(task.getStatus()))
                .count();

        this.overallCompletionPercentage = this.taskCount > 0
                ? (this.completedTaskCount * 100) / this.taskCount
                : 0;
    }
}