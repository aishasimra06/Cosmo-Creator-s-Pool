package com.creatorhub.dto.notification;

import com.creatorhub.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String message;
    private Notification.NotificationType type;
    private Boolean isRead;
    private Long referenceId;
    private Long senderId;
    private LocalDateTime createdAt;
}
