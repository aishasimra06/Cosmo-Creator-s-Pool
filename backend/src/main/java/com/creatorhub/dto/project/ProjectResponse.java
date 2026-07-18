package com.creatorhub.dto.project;

import com.creatorhub.entity.CollaborationProject;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private String bannerUrl;
    private Integer teamSize;
    private LocalDate deadline;
    private CollaborationProject.ProjectStatus status;
    private List<String> categoryNames;
    private Long creatorId;
    private String creatorName;
    private String creatorUsername;
    private String creatorAvatarUrl;
    private List<String> requiredSkills;
    private Integer applicantCount;
    private Boolean hasAcceptedCollaborators;
    private LocalDateTime createdAt;
}
