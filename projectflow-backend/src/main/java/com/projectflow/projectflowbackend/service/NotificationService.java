package com.projectflow.projectflowbackend.service;

import com.projectflow.projectflowbackend.domain.Notification;
import com.projectflow.projectflowbackend.domain.User;
import com.projectflow.projectflowbackend.dto.NotificationResponse;
import com.projectflow.projectflowbackend.exception.ResourceNotFoundException;
import com.projectflow.projectflowbackend.exception.UnauthorizedException;
import com.projectflow.projectflowbackend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Map<String, Object> getNotificationsForUser(User currentUser) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        List<Notification> notifications = notificationRepository.findByRecipientId(currentUser.getId(), sort);
        long unreadCount = notificationRepository.countByRecipientIdAndIsReadFalse(currentUser.getId());

        List<NotificationResponse> responseList = notifications.stream()
                .map(NotificationResponse::new)
                .collect(Collectors.toList());

        return Map.of(
                "data", responseList,
                "unreadCount", unreadCount);
    }

    public void markAsRead(String notificationId, User currentUser) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getRecipient().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("User not authorized to update this notification");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(User currentUser) {
        List<Notification> unreadNotifications = notificationRepository
                .findByRecipientIdAndIsReadFalse(currentUser.getId());
        unreadNotifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
}