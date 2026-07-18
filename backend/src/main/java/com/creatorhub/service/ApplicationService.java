package com.creatorhub.service;

import com.creatorhub.dto.project.ApplicationResponse;
import com.creatorhub.entity.CollaborationProject;
import com.creatorhub.entity.CollaborationRequest;
import com.creatorhub.entity.Notification;
import com.creatorhub.entity.ProjectCollaborator;
import com.creatorhub.exception.ResourceNotFoundException;
import com.creatorhub.exception.UnauthorizedException;
import com.creatorhub.repository.CollaborationRequestRepository;
import com.creatorhub.repository.ProjectCollaboratorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final CollaborationRequestRepository requestRepository;
    private final NotificationService notificationService;
    private final ProjectCollaboratorRepository collaboratorRepository;

    public ApplicationResponse getApplicationById(Long id) {
        CollaborationRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));
        return mapToApplicationResponse(request);
    }

    @Transactional
    public ApplicationResponse updateStatus(Long id, CollaborationRequest.RequestStatus status, String currentUserEmail) {
        CollaborationRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));

        CollaborationProject project = request.getProject();

        if (!project.getCreator().getEmail().equals(currentUserEmail)) {
            throw new UnauthorizedException("Only the project creator can update applicant status");
        }

        request.setStatus(status);
        requestRepository.save(request);

        // Add collaborator if accepted
        if (status == CollaborationRequest.RequestStatus.ACCEPTED) {
            if (!collaboratorRepository.existsByProjectIdAndUserId(project.getId(), request.getApplicant().getId())) {
                collaboratorRepository.save(ProjectCollaborator.builder()
                        .project(project)
                        .user(request.getApplicant())
                        .role(request.getRequestedRole())
                        .build());
            }
        }

        // Notify applicant
        String notifMsg = "";
        Notification.NotificationType notifType = null;

        if (status == CollaborationRequest.RequestStatus.ACCEPTED) {
            notifMsg = "Your collaboration request for '" + project.getTitle() + "' was ACCEPTED!";
            notifType = Notification.NotificationType.APPLICATION_ACCEPTED;
        } else if (status == CollaborationRequest.RequestStatus.REJECTED) {
            notifMsg = "Your application to '" + project.getTitle() + "' was declined.";
            notifType = Notification.NotificationType.APPLICATION_REJECTED;
        } else if (status == CollaborationRequest.RequestStatus.SHORTLISTED) {
            notifMsg = "You were shortlisted for '" + project.getTitle() + "'!";
            notifType = Notification.NotificationType.APPLICATION_SHORTLISTED;
        }

        if (notifType != null) {
            notificationService.createNotification(
                    request.getApplicant(),
                    notifMsg,
                    notifType,
                    project.getId(),
                    project.getCreator().getId()
            );
        }

        return mapToApplicationResponse(request);
    }

    private ApplicationResponse mapToApplicationResponse(CollaborationRequest r) {
        return ApplicationResponse.builder()
                .id(r.getId())
                .projectId(r.getProject().getId())
                .projectTitle(r.getProject().getTitle())
                .applicantId(r.getApplicant().getId())
                .applicantName(r.getApplicant().getName())
                .applicantUsername(r.getApplicant().getUsername())
                .applicantAvatarUrl(r.getApplicant().getAvatarUrl())
                .message(r.getMessage())
                .requestedRole(r.getRequestedRole())
                .portfolioLink(r.getPortfolioLink())
                .status(r.getStatus())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
