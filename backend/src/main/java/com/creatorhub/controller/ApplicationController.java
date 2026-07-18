package com.creatorhub.controller;

import com.creatorhub.dto.project.ApplicationResponse;
import com.creatorhub.entity.CollaborationRequest;
import com.creatorhub.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Collaboration application management")
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping("/{id}")
    @Operation(summary = "Get application details")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PutMapping("/{id}/shortlist")
    @Operation(summary = "Shortlist an applicant")
    public ResponseEntity<ApplicationResponse> shortlistApplicant(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.updateStatus(id, CollaborationRequest.RequestStatus.SHORTLISTED, userDetails.getUsername()));
    }

    @PutMapping("/{id}/accept")
    @Operation(summary = "Accept an applicant")
    public ResponseEntity<ApplicationResponse> acceptApplicant(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.updateStatus(id, CollaborationRequest.RequestStatus.ACCEPTED, userDetails.getUsername()));
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject an applicant")
    public ResponseEntity<ApplicationResponse> rejectApplicant(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.updateStatus(id, CollaborationRequest.RequestStatus.REJECTED, userDetails.getUsername()));
    }
}
