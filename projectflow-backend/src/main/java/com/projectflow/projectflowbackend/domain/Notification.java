package com.projectflow.projectflowbackend.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {
    @Id
    private String id;

    @DBRef
    private User recipient;

    @DBRef
    private User sender;

    private NotificationType type;
    private String message;
    private String link;

    @DBRef
    private Project relatedProject;

    private String relatedTaskTitle;
    private boolean isRead = false;

    @CreatedDate
    private LocalDateTime createdAt;
}