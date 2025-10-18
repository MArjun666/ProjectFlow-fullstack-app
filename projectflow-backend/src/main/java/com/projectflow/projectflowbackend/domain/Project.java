package com.projectflow.projectflowbackend.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "projects")
@Getter
@Setter
@NoArgsConstructor
public class Project {

    @Id
    private String id;
    private String name;
    private String description;
    private ProjectStatus status;

    @DBRef
    private User user; // Creator of the project

    @DBRef
    private User projectManager;

    @DBRef
    private List<User> teamMembers = new ArrayList<>();

    private LocalDate startDate;
    private LocalDate endDate;
    private String clientName;
    private String clientEmail;
    private String clientCompany;

    private List<Task> tasks = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}