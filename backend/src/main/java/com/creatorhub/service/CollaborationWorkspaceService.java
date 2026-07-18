package com.creatorhub.service;

import com.creatorhub.dto.workspace.CollaboratorResponse;
import com.creatorhub.dto.workspace.MessageRequest;
import com.creatorhub.dto.workspace.MessageResponse;
import com.creatorhub.dto.workspace.UpdateRequest;
import com.creatorhub.dto.workspace.UpdateResponse;
import com.creatorhub.entity.*;
import com.creatorhub.exception.ResourceNotFoundException;
import com.creatorhub.exception.UnauthorizedException;
import com.creatorhub.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CollaborationWorkspaceService {

    private final CollaborationProjectRepository projectRepository;
    private final ProjectCollaboratorRepository collaboratorRepository;
    private final CollaborationRequestRepository requestRepository;
    private final ProjectMessageRepository messageRepository;
    private final ProjectUpdateRepository updateRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // Helper to check if user has access to workspace
    private CollaborationProject getProjectAndVerifyAccess(Long projectId, String username) {
        CollaborationProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        User currentUser = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        boolean isOwner = project.getCreator().getId().equals(currentUser.getId());
        boolean isCollaborator = collaboratorRepository.existsByProjectIdAndUserId(projectId, currentUser.getId());
        
        // Fallback for legacy accepted applicants that might not be in the project_collaborators table
        if (!isOwner && !isCollaborator) {
            boolean isAcceptedApplicant = requestRepository.existsByProjectIdAndApplicantIdAndStatus(
                projectId, currentUser.getId(), CollaborationRequest.RequestStatus.ACCEPTED
            );
            if (!isAcceptedApplicant) {
                throw new UnauthorizedException("You do not have access to this collaboration workspace.");
            }
        }

        return project;
    }

    private User getCurrentUser(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    public List<CollaboratorResponse> getWorkspaceTeam(Long projectId, String username) {
        CollaborationProject project = getProjectAndVerifyAccess(projectId, username);

        List<CollaboratorResponse> team = new ArrayList<>();
        
        // Add Owner
        team.add(CollaboratorResponse.builder()
                .userId(project.getCreator().getId())
                .name(project.getCreator().getName())
                .username(project.getCreator().getUsername())
                .avatarUrl(project.getCreator().getAvatarUrl())
                .role("Project Owner")
                .bio(project.getCreator().getBio())
                .build());

        // Add Collaborators
        List<ProjectCollaborator> collaborators = collaboratorRepository.findByProjectId(projectId);
        Set<Long> addedUserIds = new HashSet<>();
        addedUserIds.add(project.getCreator().getId());

        for (ProjectCollaborator c : collaborators) {
            team.add(CollaboratorResponse.builder()
                    .userId(c.getUser().getId())
                    .name(c.getUser().getName())
                    .username(c.getUser().getUsername())
                    .avatarUrl(c.getUser().getAvatarUrl())
                    .role(c.getRole() != null ? c.getRole() : "Collaborator")
                    .bio(c.getUser().getBio())
                    .build());
            addedUserIds.add(c.getUser().getId());
        }

        // Fallback: Add any ACCEPTED applicants not in the collaborators table
        List<CollaborationRequest> acceptedRequests = requestRepository.findByProjectIdAndStatus(projectId, CollaborationRequest.RequestStatus.ACCEPTED);
        for (CollaborationRequest req : acceptedRequests) {
            if (!addedUserIds.contains(req.getApplicant().getId())) {
                team.add(CollaboratorResponse.builder()
                        .userId(req.getApplicant().getId())
                        .name(req.getApplicant().getName())
                        .username(req.getApplicant().getUsername())
                        .avatarUrl(req.getApplicant().getAvatarUrl())
                        .role(req.getRequestedRole() != null ? req.getRequestedRole() : "Collaborator")
                        .bio(req.getApplicant().getBio())
                        .build());
                addedUserIds.add(req.getApplicant().getId());
            }
        }

        return team;
    }

    public List<MessageResponse> getMessages(Long projectId, String username) {
        getProjectAndVerifyAccess(projectId, username);

        return messageRepository.findByProjectIdOrderByCreatedAtAsc(projectId).stream()
                .map(m -> MessageResponse.builder()
                        .id(m.getId())
                        .senderId(m.getSender().getId())
                        .senderName(m.getSender().getName())
                        .senderAvatarUrl(m.getSender().getAvatarUrl())
                        .message(m.getMessage())
                        .createdAt(m.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageResponse sendMessage(Long projectId, MessageRequest request, String username) {
        CollaborationProject project = getProjectAndVerifyAccess(projectId, username);
        User sender = getCurrentUser(username);

        ProjectMessage message = ProjectMessage.builder()
                .project(project)
                .sender(sender)
                .message(request.getMessage())
                .build();

        message = messageRepository.save(message);

        // Notify other team members
        notifyTeam(project, sender, "New message in workspace: " + project.getTitle(), Notification.NotificationType.WORKSPACE_MESSAGE);

        return MessageResponse.builder()
                .id(message.getId())
                .senderId(sender.getId())
                .senderName(sender.getName())
                .senderAvatarUrl(sender.getAvatarUrl())
                .message(message.getMessage())
                .createdAt(message.getCreatedAt())
                .build();
    }

    public List<UpdateResponse> getUpdates(Long projectId, String username) {
        getProjectAndVerifyAccess(projectId, username);

        return updateRepository.findByProjectIdOrderByCreatedAtDesc(projectId).stream()
                .map(u -> UpdateResponse.builder()
                        .id(u.getId())
                        .authorId(u.getAuthor().getId())
                        .authorName(u.getAuthor().getName())
                        .authorAvatarUrl(u.getAuthor().getAvatarUrl())
                        .content(u.getContent())
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public UpdateResponse postUpdate(Long projectId, UpdateRequest request, String username) {
        CollaborationProject project = getProjectAndVerifyAccess(projectId, username);
        User author = getCurrentUser(username);

        if (!project.getCreator().getId().equals(author.getId())) {
            throw new UnauthorizedException("Only the project owner can post official updates.");
        }

        ProjectUpdate update = ProjectUpdate.builder()
                .project(project)
                .author(author)
                .content(request.getContent())
                .build();

        update = updateRepository.save(update);

        notifyTeam(project, author, project.getCreator().getName() + " posted a new project update in " + project.getTitle(), Notification.NotificationType.PROJECT_UPDATE);

        return UpdateResponse.builder()
                .id(update.getId())
                .authorId(author.getId())
                .authorName(author.getName())
                .authorAvatarUrl(author.getAvatarUrl())
                .content(update.getContent())
                .createdAt(update.getCreatedAt())
                .build();
    }

    private void notifyTeam(CollaborationProject project, User sender, String message, Notification.NotificationType type) {
        List<User> team = new ArrayList<>();
        team.add(project.getCreator());
        
        Set<Long> addedUserIds = new HashSet<>();
        addedUserIds.add(project.getCreator().getId());

        collaboratorRepository.findByProjectId(project.getId()).forEach(c -> {
            team.add(c.getUser());
            addedUserIds.add(c.getUser().getId());
        });

        requestRepository.findByProjectIdAndStatus(project.getId(), CollaborationRequest.RequestStatus.ACCEPTED).forEach(req -> {
            if (!addedUserIds.contains(req.getApplicant().getId())) {
                team.add(req.getApplicant());
                addedUserIds.add(req.getApplicant().getId());
            }
        });

        for (User member : team) {
            if (!member.getId().equals(sender.getId())) {
                notificationService.createNotification(
                        member,
                        message,
                        type,
                        project.getId(),
                        sender.getId()
                );
            }
        }
    }

    @Transactional
    public void closeProject(Long projectId, String username) {
        CollaborationProject project = getProjectAndVerifyAccess(projectId, username);

        if (!project.getCreator().getEmail().equals(username)) {
            throw new UnauthorizedException("Only the project owner can close the project.");
        }

        if (project.getStatus() == CollaborationProject.ProjectStatus.COMPLETED || 
            project.getStatus() == CollaborationProject.ProjectStatus.CLOSED) {
            throw new IllegalStateException("Project is already closed or completed.");
        }

        project.setStatus(CollaborationProject.ProjectStatus.COMPLETED);
        projectRepository.save(project);

        // Increment completedCollaborations for owner
        User owner = project.getCreator();
        owner.setCompletedCollaborations((owner.getCompletedCollaborations() == null ? 0 : owner.getCompletedCollaborations()) + 1);
        userRepository.save(owner);

        // Increment completedCollaborations for all accepted collaborators
        List<ProjectCollaborator> collaborators = collaboratorRepository.findByProjectId(projectId);
        for (ProjectCollaborator collab : collaborators) {
            User user = collab.getUser();
            user.setCompletedCollaborations((user.getCompletedCollaborations() == null ? 0 : user.getCompletedCollaborations()) + 1);
            userRepository.save(user);
            
            notificationService.createNotification(
                    user,
                    "The project '" + project.getTitle() + "' has been marked as COMPLETED! Your profile stats have been updated.",
                    Notification.NotificationType.PROJECT_CLOSED,
                    project.getId(),
                    owner.getId()
            );
        }
    }
}
