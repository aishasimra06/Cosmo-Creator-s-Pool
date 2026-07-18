package com.creatorhub.service;

import com.creatorhub.dto.notification.NotificationResponse;
import com.creatorhub.entity.Notification;
import com.creatorhub.entity.User;
import com.creatorhub.exception.ResourceNotFoundException;
import com.creatorhub.repository.NotificationRepository;
import com.creatorhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createNotification(User user, String message, Notification.NotificationType type, Long referenceId, Long senderId) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .type(type)
                .referenceId(referenceId)
                .senderId(senderId)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
        log.info("Notification created for user: {}", user.getEmail());
    }

    public List<NotificationResponse> getUserNotifications(String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationResponse markAsRead(Long id, String currentUserEmail) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));

        if (!notification.getUser().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Access denied");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
        return mapToResponse(notification);
    }

    @Transactional
    public void markAllAsRead(String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));
        notificationRepository.markAllAsReadByUserId(user.getId());
    }

    public long getUnreadCount(String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));
        return notificationRepository.countByUserIdAndIsRead(user.getId(), false);
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .message(n.getMessage())
                .type(n.getType())
                .isRead(n.getIsRead())
                .referenceId(n.getReferenceId())
                .senderId(n.getSenderId())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
