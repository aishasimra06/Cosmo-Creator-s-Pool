package com.creatorhub.dto.project;

import com.creatorhub.entity.CollaborationRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long applicantId;
    private String applicantName;
    private String applicantUsername;
    private String applicantAvatarUrl;
    private String message;
    private String requestedRole;
    private String portfolioLink;
    private CollaborationRequest.RequestStatus status;
    private LocalDateTime createdAt;
}
