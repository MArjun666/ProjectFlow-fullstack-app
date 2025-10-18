package com.projectflow.projectflowbackend.repository;

import com.projectflow.projectflowbackend.domain.Notification;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    /**
     * Finds all notifications for a specific recipient, sorted by a given criteria.
     */
    List<Notification> findByRecipientId(String recipientId, Sort sort);

    /**
     * Counts the number of unread notifications for a specific recipient.
     */
    long countByRecipientIdAndIsReadFalse(String recipientId);

    /**
     * Finds all notifications for a recipient that are currently unread.
     */
    List<Notification> findByRecipientIdAndIsReadFalse(String recipientId);
}