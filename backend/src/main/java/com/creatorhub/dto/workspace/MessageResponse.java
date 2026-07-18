package com.creatorhub.dto.workspace;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderAvatarUrl;
    private String message;
    private LocalDateTime createdAt;
}
