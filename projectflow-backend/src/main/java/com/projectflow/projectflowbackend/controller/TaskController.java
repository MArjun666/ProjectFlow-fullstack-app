package com.projectflow.projectflowbackend.controller;

import com.projectflow.projectflowbackend.domain.Project;
import com.projectflow.projectflowbackend.domain.User;
import com.projectflow.projectflowbackend.dto.MyTaskResponse;
import com.projectflow.projectflowbackend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

        private final ProjectRepository projectRepository;

        @GetMapping("/mytasks")
        public ResponseEntity<List<MyTaskResponse>> getMyTasks(@AuthenticationPrincipal User currentUser) {
                ObjectId userObjectId = new ObjectId(currentUser.getId());
                List<Project> userProjects = projectRepository.findProjectsByUserId(userObjectId);

                List<MyTaskResponse> myTasks = userProjects.stream()
                                .flatMap(project -> project.getTasks().stream()
                                                .filter(task -> task.getAssignedTo() != null
                                                                && task.getAssignedTo().getId()
                                                                                .equals(currentUser.getId()))
                                                .map(task -> new MyTaskResponse(task, project.getName(),
                                                                project.getId())))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(myTasks);
        }
}