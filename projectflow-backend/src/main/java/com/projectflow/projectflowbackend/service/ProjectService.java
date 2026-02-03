package com.projectflow.projectflowbackend.service;

import com.projectflow.projectflowbackend.domain.*;
import com.projectflow.projectflowbackend.dto.ProjectRequest;
import com.projectflow.projectflowbackend.dto.ProjectResponse;
import com.projectflow.projectflowbackend.dto.TaskRequest;
import com.projectflow.projectflowbackend.dto.TaskResponse;
import com.projectflow.projectflowbackend.dto.UserResponse;
import com.projectflow.projectflowbackend.exception.ResourceNotFoundException;
import com.projectflow.projectflowbackend.exception.UnauthorizedException;
import com.projectflow.projectflowbackend.repository.NotificationRepository;
import com.projectflow.projectflowbackend.repository.ProjectRepository;
import com.projectflow.projectflowbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public List<UserResponse> getAssignableUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public List<ProjectResponse> getProjectsForUser(User currentUser) {
        // We pass the same user object to all three fields to check if they are the
        // creator, PM, or a member
        return projectRepository
                .findByUserOrProjectManagerOrTeamMembersContaining(currentUser, currentUser, currentUser)
                .stream()
                .map(ProjectResponse::new)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(String projectId, User currentUser) {
        Project project = findProjectById(projectId);
        checkProjectMembership(project, currentUser);
        return new ProjectResponse(project);
    }

    public ProjectResponse createProject(ProjectRequest req, User currentUser) {
        if (req.getName() == null || req.getName().trim().isEmpty())
            throw new IllegalArgumentException("Project Name is required.");
        if (req.getProjectManager() == null || req.getProjectManager().trim().isEmpty())
            throw new IllegalArgumentException("A Project Manager must be selected.");

        Project project = new Project();
        project.setName(req.getName());
        project.setDescription(req.getDescription());
        project.setUser(currentUser);
        project.setStatus(parseProjectStatus(req.getStatus()));
        updateProjectFieldsFromRequest(project, req);

        User projectManager = findUserById(req.getProjectManager());
        project.setProjectManager(projectManager);

        // --- FIX: Use a Set of Strings (IDs) to guarantee uniqueness ---
        Set<String> uniqueUserIds = new HashSet<>();
        uniqueUserIds.add(currentUser.getId());
        uniqueUserIds.add(projectManager.getId());

        if (req.getTeamMembers() != null) {
            uniqueUserIds.addAll(req.getTeamMembers());
        }

        // Fetch all unique users in one batch
        List<User> finalMembers = userRepository.findAllById(uniqueUserIds);
        project.setTeamMembers(finalMembers);

        Project savedProject = projectRepository.save(project);

        // Notification logic remains the same...
        for (User member : finalMembers) {
            if (!member.getId().equals(currentUser.getId())) {
                createAndSaveNotification(
                        currentUser, member, savedProject, null, NotificationType.generic,
                        String.format("%s added you to the project '%s'.", currentUser.getName(),
                                savedProject.getName()),
                        "/projects/" + savedProject.getId());
            }
        }

        return new ProjectResponse(savedProject);
    }

    public ProjectResponse updateProject(String projectId, ProjectRequest req, User currentUser) {
        Project project = findProjectById(projectId);
        checkAdminOrPM(project, currentUser);

        project.setName(req.getName());
        project.setDescription(req.getDescription());
        project.setStatus(parseProjectStatus(req.getStatus()));

        if (req.getProjectManager() != null && !req.getProjectManager().isEmpty()) {
            project.setProjectManager(findUserById(req.getProjectManager()));
        }

        if (req.getTeamMembers() != null) {
            // --- FIX: Ensure unique IDs here too ---
            Set<String> uniqueIds = new HashSet<>(req.getTeamMembers());
            if (project.getProjectManager() != null)
                uniqueIds.add(project.getProjectManager().getId());
            project.setTeamMembers(userRepository.findAllById(uniqueIds));
        }

        updateProjectFieldsFromRequest(project, req);
        return new ProjectResponse(projectRepository.save(project));
    }

    public void deleteProject(String projectId, User currentUser) {
        Project project = findProjectById(projectId);
        if (!currentUser.getRole().equals(UserRole.admin) && !project.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only the project creator or an admin can delete this project.");
        }
        projectRepository.delete(project);
    }

    public ProjectResponse addMemberToProject(String projectId, String userId, User currentUser) {
        Project project = findProjectById(projectId);
        checkAdminOrPM(project, currentUser);
        User userToAdd = findUserById(userId);

        // --- FIX: Prevent adding if the ID is already present in the list ---
        boolean alreadyMember = project.getTeamMembers().stream()
                .anyMatch(member -> member.getId().equals(userId));

        if (!alreadyMember) {
            project.getTeamMembers().add(userToAdd);
            createAndSaveNotification(
                    currentUser, userToAdd, project, null, NotificationType.generic,
                    String.format("%s added you to the project '%s'.", currentUser.getName(), project.getName()),
                    "/projects/" + projectId);
        }
        return new ProjectResponse(projectRepository.save(project));
    }

    public ProjectResponse removeMemberFromProject(String projectId, String userId, User currentUser) {
        Project project = findProjectById(projectId);
        checkAdminOrPM(project, currentUser);
        project.getTeamMembers().removeIf(member -> member.getId().equals(userId));

        project.getTasks().forEach(task -> {
            if (task.getAssignedTo() != null && task.getAssignedTo().getId().equals(userId)) {
                task.setAssignedTo(null);
            }
        });
        return new ProjectResponse(projectRepository.save(project));
    }

    public TaskResponse createTask(String projectId, TaskRequest req, User currentUser) {
        Project project = findProjectById(projectId);
        checkAdminOrPM(project, currentUser);

        Task task = new Task();
        task.setId(new ObjectId().toString());
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setStatus(TaskStatus.To_Do);

        if (req.getAssignedTo() != null && !req.getAssignedTo().isEmpty()) {
            User assignedUser = findUserById(req.getAssignedTo());
            task.setAssignedTo(assignedUser);
            task.setAcceptanceStatus(AcceptanceStatus.Pending);

            createAndSaveNotification(
                    currentUser, assignedUser, project, task.getTitle(), NotificationType.newTaskAssigned,
                    String.format("%s assigned you a new task: '%s'.", currentUser.getName(), task.getTitle()),
                    "/projects/" + projectId);
        }

        if (req.getDueDate() != null && !req.getDueDate().isEmpty()) {
            task.setDueDate(LocalDate.parse(req.getDueDate()));
        }

        project.getTasks().add(task);
        projectRepository.save(project);
        return new TaskResponse(task);
    }

    public TaskResponse updateTask(String projectId, String taskId, TaskRequest req, User currentUser) {
        Project project = findProjectById(projectId);
        Task task = findTaskInProject(project, taskId);

        boolean isPM = project.getProjectManager() != null
                && project.getProjectManager().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == UserRole.admin;
        boolean isAssignedToUser = task.getAssignedTo() != null
                && task.getAssignedTo().getId().equals(currentUser.getId());
        if (!isPM && !isAdmin && !isAssignedToUser) {
            throw new UnauthorizedException("You are not authorized to update this task.");
        }

        if (req.getTitle() != null) {
            task.setTitle(req.getTitle());
        }
        if (req.getDescription() != null) {
            task.setDescription(req.getDescription());
        }
        if (req.getStatus() != null) {
            task.setStatus(parseTaskStatus(req.getStatus()));
        }
        if (req.getDueDate() != null) {
            task.setDueDate(req.getDueDate().isEmpty() ? null : LocalDate.parse(req.getDueDate()));
        }

        projectRepository.save(project);
        return new TaskResponse(task);
    }

    public void deleteTask(String projectId, String taskId, User currentUser) {
        Project project = findProjectById(projectId);
        checkAdminOrPM(project, currentUser);
        project.getTasks().removeIf(t -> t.getId().equals(taskId));
        projectRepository.save(project);
    }

    public TaskResponse updateTaskAcceptance(String projectId, String taskId, String acceptanceStatusStr,
            User currentUser) {
        Project project = findProjectById(projectId);
        Task task = findTaskInProject(project, taskId);
        User projectManager = project.getProjectManager();

        if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not assigned to this task.");
        }

        AcceptanceStatus newStatus = parseAcceptanceStatus(acceptanceStatusStr);
        task.setAcceptanceStatus(newStatus);

        if (newStatus == AcceptanceStatus.Accepted) {
            task.setStatus(TaskStatus.In_Progress);
            createAndSaveNotification(
                    currentUser, projectManager, project, task.getTitle(), NotificationType.taskAccepted,
                    String.format("%s accepted the task: '%s'.", currentUser.getName(), task.getTitle()),
                    "/projects/" + projectId);
        } else if (newStatus == AcceptanceStatus.RejectedByTeamMember) {
            createAndSaveNotification(
                    currentUser, projectManager, project, task.getTitle(), NotificationType.taskRejectedByTeamMember,
                    String.format("%s rejected the task: '%s'.", currentUser.getName(), task.getTitle()),
                    "/projects/" + projectId);
        }

        projectRepository.save(project);
        return new TaskResponse(task);
    }

    // --- Private Helper Methods ---

    private Project findProjectById(String projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
    }

    private User findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private Task findTaskInProject(Project project, String taskId) {
        return project.getTasks().stream().filter(t -> t.getId().equals(taskId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
    }

    private void checkAdminOrPM(Project project, User currentUser) {
        // 1. Check if the user has the Global Role of Admin
        boolean hasAdminRole = currentUser.getRole() == UserRole.admin;

        // 2. Check if the user has the Global Role of Project Manager
        boolean hasPMRole = currentUser.getRole() == UserRole.projectManager;

        // 3. Check if they are the SPECIFIC PM assigned to this project
        boolean isAssignedToThisProject = project.getProjectManager() != null
                && project.getProjectManager().getId().equals(currentUser.getId());

        // FIX: Allow if they are an Admin OR if they have the Project Manager role
        // This allows a PM to edit projects even if they weren't the one assigned by
        // the Admin
        if (!hasAdminRole && !hasPMRole && !isAssignedToThisProject) {
            throw new UnauthorizedException(
                    "Access Denied: Only users with Project Manager or Admin roles can perform this action.");
        }
    }

    private void checkProjectMembership(Project project, User currentUser) {
        boolean isMember = project.getTeamMembers().stream().anyMatch(tm -> tm.getId().equals(currentUser.getId()));
        boolean isPM = project.getProjectManager() != null
                && project.getProjectManager().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == UserRole.admin;
        if (!isMember && !isPM && !isAdmin) {
            throw new UnauthorizedException("User is not a member of this project.");
        }
    }

    private void updateProjectFieldsFromRequest(Project project, ProjectRequest req) {
        project.setStartDate(
                req.getStartDate() != null && !req.getStartDate().isEmpty() ? LocalDate.parse(req.getStartDate())
                        : null);
        project.setEndDate(
                req.getEndDate() != null && !req.getEndDate().isEmpty() ? LocalDate.parse(req.getEndDate()) : null);
        project.setClientName(req.getClientName());
        project.setClientEmail(req.getClientEmail());
        project.setClientCompany(req.getClientCompany());
    }

    private void createAndSaveNotification(User sender, User recipient, Project project, String taskTitle,
            NotificationType type, String message, String link) {
        if (sender.getId().equals(recipient.getId())) {
            return;
        }
        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setRecipient(recipient);
        notification.setRelatedProject(project);
        notification.setRelatedTaskTitle(taskTitle);
        notification.setType(type);
        notification.setMessage(message);
        notification.setLink(link);
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    private ProjectStatus parseProjectStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return ProjectStatus.Not_Started;
        }
        try {
            String formattedStatus = status.replace(" ", "_");
            return ProjectStatus.valueOf(formattedStatus);
        } catch (IllegalArgumentException e) {
            System.err.println("Warning: Received invalid project status string: '" + status + "'");
            return ProjectStatus.Not_Started;
        }
    }

    private TaskStatus parseTaskStatus(String status) {
        if (status == null)
            return TaskStatus.To_Do;
        try {
            return TaskStatus.valueOf(status.replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            System.err.println("Warning: Received invalid task status string: '" + status + "'");
            return TaskStatus.To_Do;
        }
    }

    private AcceptanceStatus parseAcceptanceStatus(String status) {
        if (status == null)
            return AcceptanceStatus.Pending;
        try {
            return AcceptanceStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            return AcceptanceStatus.Pending;
        }
    }
}