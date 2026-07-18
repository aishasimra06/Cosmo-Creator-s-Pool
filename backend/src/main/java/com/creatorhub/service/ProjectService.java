package com.creatorhub.service;

import com.creatorhub.dto.project.ApplyRequest;
import com.creatorhub.dto.project.ApplicationResponse;
import com.creatorhub.dto.project.ProjectRequest;
import com.creatorhub.dto.project.ProjectResponse;
import com.creatorhub.entity.*;
import com.creatorhub.exception.DuplicateResourceException;
import com.creatorhub.exception.ResourceNotFoundException;
import com.creatorhub.exception.UnauthorizedException;
import com.creatorhub.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final CollaborationProjectRepository projectRepository;
    private final CollaborationRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final CategoryRepository categoryRepository;
    private final NotificationService notificationService;
    private final CloudinaryService cloudinaryService;
    private final ProjectCollaboratorRepository collaboratorRepository;

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectResponse> getProjectsByStatus(CollaborationProject.ProjectStatus status) {
        return projectRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectResponse> searchProjects(String query) {
        return projectRepository.searchProjects(query).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(Long id) {
        CollaborationProject project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return mapToResponse(project);
    }

    public List<ProjectResponse> getMyProjects(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return projectRepository.findByCreatorId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getMyApplications(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return requestRepository.findByApplicantId(user.getId()).stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, MultipartFile banner, String currentUserEmail) {
        User creator = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        Set<Category> categories = new HashSet<>();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            categories.addAll(categoryRepository.findAllById(request.getCategoryIds()));
        }

        Set<Skill> skills = resolveSkills(request.getRequiredSkills());

        CollaborationProject project = CollaborationProject.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .teamSize(request.getTeamSize())
                .deadline(request.getDeadline())
                .status(request.getStatus() != null ? request.getStatus() : CollaborationProject.ProjectStatus.OPEN)
                .creator(creator)
                .categories(categories)
                .requiredSkills(skills)
                .build();

        if (banner != null && !banner.isEmpty()) {
            String bannerUrl = cloudinaryService.uploadImage(banner, "project-banners");
            project.setBannerUrl(bannerUrl);
        }

        projectRepository.save(project);
        log.info("Project created: {} by {}", project.getTitle(), currentUserEmail);
        return mapToResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request, MultipartFile banner, String currentUserEmail) {
        CollaborationProject project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        if (!project.getCreator().getEmail().equals(currentUserEmail)) {
            throw new UnauthorizedException("You can only edit your own projects");
        }

        if (request.getTitle() != null) project.setTitle(request.getTitle());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getTeamSize() != null) project.setTeamSize(request.getTeamSize());
        if (request.getDeadline() != null) project.setDeadline(request.getDeadline());
        if (request.getStatus() != null) project.setStatus(request.getStatus());

        if (request.getCategoryIds() != null) {
            project.setCategories(new HashSet<>(categoryRepository.findAllById(request.getCategoryIds())));
        }

        if (request.getRequiredSkills() != null) {
            project.setRequiredSkills(resolveSkills(request.getRequiredSkills()));
        }

        if (banner != null && !banner.isEmpty()) {
            String bannerUrl = cloudinaryService.uploadImage(banner, "project-banners");
            project.setBannerUrl(bannerUrl);
        }

        projectRepository.save(project);
        return mapToResponse(project);
    }

    @Transactional
    public void deleteProject(Long id, String currentUserEmail) {
        CollaborationProject project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow();

        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(r -> r.getName() == Role.RoleName.ADMIN);

        if (!project.getCreator().getEmail().equals(currentUserEmail) && !isAdmin) {
            throw new UnauthorizedException("You can only delete your own projects");
        }

        projectRepository.delete(project);
    }

    @Transactional
    public ApplicationResponse applyToProject(Long projectId, ApplyRequest request, String currentUserEmail) {
        CollaborationProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        User applicant = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        if (project.getCreator().getEmail().equals(currentUserEmail)) {
            throw new IllegalArgumentException("You cannot apply to your own project");
        }

        if (requestRepository.existsByProjectIdAndApplicantId(projectId, applicant.getId())) {
            throw new DuplicateResourceException("You have already applied to this project");
        }

        CollaborationRequest colabRequest = CollaborationRequest.builder()
                .project(project)
                .applicant(applicant)
                .message(request.getMessage())
                .requestedRole(request.getRequestedRole())
                .portfolioLink(request.getPortfolioLink())
                .status(CollaborationRequest.RequestStatus.PENDING)
                .build();

        requestRepository.save(colabRequest);

        // Notify project creator
        notificationService.createNotification(
            project.getCreator(),
            applicant.getName() + " applied to your project: " + project.getTitle(),
            Notification.NotificationType.APPLICATION_RECEIVED,
            projectId,
            applicant.getId()
        );

        return mapToApplicationResponse(colabRequest);
    }

    public List<ApplicationResponse> getProjectApplicants(Long projectId, String currentUserEmail) {
        CollaborationProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        if (!project.getCreator().getEmail().equals(currentUserEmail)) {
            throw new UnauthorizedException("Only the project creator can view applicants");
        }

        return requestRepository.findByProjectId(projectId).stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    private Set<Skill> resolveSkills(List<String> skillNames) {
        Set<Skill> skills = new HashSet<>();
        if (skillNames == null) return skills;
        for (String skillName : skillNames) {
            Skill skill = skillRepository.findByNameIgnoreCase(skillName)
                    .orElseGet(() -> skillRepository.save(Skill.builder().name(skillName).build()));
            skills.add(skill);
        }
        return skills;
    }

    private ProjectResponse mapToResponse(CollaborationProject p) {
        return ProjectResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .bannerUrl(p.getBannerUrl())
                .teamSize(p.getTeamSize())
                .deadline(p.getDeadline())
                .status(p.getStatus())
                .categoryNames(p.getCategories() != null ? p.getCategories().stream().map(Category::getName).collect(Collectors.toList()) : List.of())
                .creatorId(p.getCreator().getId())
                .creatorName(p.getCreator().getName())
                .creatorUsername(p.getCreator().getUsername())
                .creatorAvatarUrl(p.getCreator().getAvatarUrl())
                .requiredSkills(p.getRequiredSkills().stream().map(Skill::getName).collect(Collectors.toList()))
                .applicantCount(p.getRequests() != null ? p.getRequests().size() : 0)
                .hasAcceptedCollaborators(p.getRequests() != null && p.getRequests().stream().anyMatch(r -> r.getStatus() == CollaborationRequest.RequestStatus.ACCEPTED))
                .createdAt(p.getCreatedAt())
                .build();
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
