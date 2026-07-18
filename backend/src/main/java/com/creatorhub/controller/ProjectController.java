package com.creatorhub.controller;

import com.creatorhub.dto.project.ApplyRequest;
import com.creatorhub.dto.project.ApplicationResponse;
import com.creatorhub.dto.project.ProjectRequest;
import com.creatorhub.dto.project.ProjectResponse;
import com.creatorhub.entity.CollaborationProject;
import com.creatorhub.entity.CollaborationRequest;
import com.creatorhub.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Collaboration project management")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    @Operation(summary = "Get all projects (optionally filtered by status)")
    public ResponseEntity<List<ProjectResponse>> getAllProjects(
            @RequestParam(required = false) CollaborationProject.ProjectStatus status,
            @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(projectService.searchProjects(search));
        }
        if (status != null) {
            return ResponseEntity.ok(projectService.getProjectsByStatus(status));
        }
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/me")
    @Operation(summary = "Get projects posted by the authenticated user")
    public ResponseEntity<List<ProjectResponse>> getMyProjects(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.getMyProjects(userDetails.getUsername()));
    }

    @GetMapping("/applications/me")
    @Operation(summary = "Get applications sent by the authenticated user")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.getMyApplications(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create a new collaboration project")
    public ResponseEntity<ProjectResponse> createProject(
            @RequestPart("data") @Valid ProjectRequest request,
            @RequestPart(value = "banner", required = false) MultipartFile banner,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(request, banner, userDetails.getUsername()));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update a collaboration project")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @RequestPart("data") ProjectRequest request,
            @RequestPart(value = "banner", required = false) MultipartFile banner,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.updateProject(id, request, banner, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a project")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        projectService.deleteProject(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/apply")
    @Operation(summary = "Apply to join a collaboration project")
    public ResponseEntity<ApplicationResponse> applyToProject(
            @PathVariable Long id,
            @RequestBody ApplyRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.applyToProject(id, request, userDetails.getUsername()));
    }

    @GetMapping("/{id}/applicants")
    @Operation(summary = "View project applicants (creator only)")
    public ResponseEntity<List<ApplicationResponse>> getApplicants(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.getProjectApplicants(id, userDetails.getUsername()));
    }

}
