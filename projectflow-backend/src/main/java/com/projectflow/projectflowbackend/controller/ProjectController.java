package com.projectflow.projectflowbackend.controller;

import com.projectflow.projectflowbackend.domain.User;
import com.projectflow.projectflowbackend.dto.*;
import com.projectflow.projectflowbackend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(projectService.getProjectsForUser(currentUser));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_PROJECTMANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectRequest projectRequest,
            @AuthenticationPrincipal User currentUser) {
        ProjectResponse createdProject = projectService.createProject(projectRequest, currentUser);
        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable String projectId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(projectService.getProjectById(projectId, currentUser));
    }

    @PutMapping("/{projectId}")
    @PreAuthorize("hasAnyAuthority('ROLE_PROJECTMANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable String projectId,
            @RequestBody ProjectRequest projectRequest, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(projectService.updateProject(projectId, projectRequest, currentUser));
    }

    @DeleteMapping("/{projectId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable String projectId,
            @AuthenticationPrincipal User currentUser) {
        projectService.deleteProject(projectId, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyAuthority('ROLE_PROJECTMANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAssignableUsers() {
        return ResponseEntity.ok(projectService.getAssignableUsers());
    }

    @PostMapping("/{projectId}/members")
    @PreAuthorize("hasAnyAuthority('ROLE_PROJECTMANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<ProjectResponse> addMemberToProject(@PathVariable String projectId,
            @RequestBody MemberAssignmentRequest request, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(projectService.addMemberToProject(projectId, request.getUserId(), currentUser));
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_PROJECTMANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<ProjectResponse> removeMemberFromProject(@PathVariable String projectId,
            @PathVariable String userId, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(projectService.removeMemberFromProject(projectId, userId, currentUser));
    }

    @PostMapping("/{projectId}/tasks")
    @PreAuthorize("hasAnyAuthority('ROLE_PROJECTMANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<TaskResponse> createTask(@PathVariable String projectId, @RequestBody TaskRequest taskRequest,
            @AuthenticationPrincipal User currentUser) {
        return new ResponseEntity<>(projectService.createTask(projectId, taskRequest, currentUser), HttpStatus.CREATED);
    }

    @PutMapping("/{projectId}/tasks/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable String projectId, @PathVariable String taskId,
            @RequestBody TaskRequest taskRequest, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(projectService.updateTask(projectId, taskId, taskRequest, currentUser));
    }

    @DeleteMapping("/{projectId}/tasks/{taskId}")
    @PreAuthorize("hasAnyAuthority('ROLE_PROJECTMANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable String projectId, @PathVariable String taskId,
            @AuthenticationPrincipal User currentUser) {
        projectService.deleteTask(projectId, taskId, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{projectId}/tasks/{taskId}/accept")
    public ResponseEntity<TaskResponse> updateTaskAcceptance(@PathVariable String projectId,
            @PathVariable String taskId, @RequestBody AcceptanceUpdateRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity
                .ok(projectService.updateTaskAcceptance(projectId, taskId, request.getAcceptanceStatus(), currentUser));
    }
}