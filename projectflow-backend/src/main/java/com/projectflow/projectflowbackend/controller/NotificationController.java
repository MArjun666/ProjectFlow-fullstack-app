package com.projectflow.projectflowbackend.controller;

import com.projectflow.projectflowbackend.domain.User;
import com.projectflow.projectflowbackend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(currentUser));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id, @AuthenticationPrincipal User currentUser) {
        notificationService.markAsRead(id, currentUser);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/readall")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal User currentUser) {
        notificationService.markAllAsRead(currentUser);
        return ResponseEntity.ok().build();
    }
}