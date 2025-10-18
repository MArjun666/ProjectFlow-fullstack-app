package com.projectflow.projectflowbackend.dto;

import com.projectflow.projectflowbackend.domain.Notification;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class NotificationResponse {
    private String _id;
    private UserResponse sender;
    private String type;
    private String message;
    private String link;
    private String relatedTaskTitle;
    private boolean isRead;
    private LocalDateTime createdAt;

    public NotificationResponse(Notification notification) {
        this._id = notification.getId();
        if (notification.getSender() != null) {
            this.sender = new UserResponse(notification.getSender());
        }
        this.type = notification.getType().name();
        this.message = notification.getMessage();
        this.link = notification.getLink();
        this.relatedTaskTitle = notification.getRelatedTaskTitle();
        this.isRead = notification.isRead();
        this.createdAt = notification.getCreatedAt();
    }
}