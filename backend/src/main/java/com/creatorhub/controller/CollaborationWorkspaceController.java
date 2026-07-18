package com.creatorhub.controller;

import com.creatorhub.dto.workspace.CollaboratorResponse;
import com.creatorhub.dto.workspace.MessageRequest;
import com.creatorhub.dto.workspace.MessageResponse;
import com.creatorhub.dto.workspace.UpdateRequest;
import com.creatorhub.dto.workspace.UpdateResponse;
import com.creatorhub.service.CollaborationWorkspaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workspace")
@RequiredArgsConstructor
@Tag(name = "Workspace", description = "Collaboration workspace endpoints")
public class CollaborationWorkspaceController {

    private final CollaborationWorkspaceService workspaceService;

    @GetMapping("/{projectId}/team")
    @Operation(summary = "Get workspace team members")
    public ResponseEntity<List<CollaboratorResponse>> getTeam(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(workspaceService.getWorkspaceTeam(projectId, userDetails.getUsername()));
    }

    @GetMapping("/{projectId}/messages")
    @Operation(summary = "Get workspace messages")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(workspaceService.getMessages(projectId, userDetails.getUsername()));
    }

    @PostMapping("/{projectId}/messages")
    @Operation(summary = "Send a message to workspace")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long projectId,
            @Valid @RequestBody MessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(workspaceService.sendMessage(projectId, request, userDetails.getUsername()));
        } catch (Exception e) {
            e.printStackTrace(); // Log it
            String errorMsg = e.getClass().getName() + ": " + e.getMessage();
            if (e.getCause() != null) {
                errorMsg += " | Cause: " + e.getCause().getClass().getName() + ": " + e.getCause().getMessage();
            }
            return ResponseEntity.status(500).body(java.util.Map.of("message", errorMsg));
        }
    }

    @GetMapping("/{projectId}/updates")
    @Operation(summary = "Get official project updates")
    public ResponseEntity<List<UpdateResponse>> getUpdates(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(workspaceService.getUpdates(projectId, userDetails.getUsername()));
    }

    @PostMapping("/{projectId}/updates")
    @Operation(summary = "Post an official project update (Owner only)")
    public ResponseEntity<?> postUpdate(
            @PathVariable Long projectId,
            @Valid @RequestBody UpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(workspaceService.postUpdate(projectId, request, userDetails.getUsername()));
        } catch (Exception e) {
            e.printStackTrace();
            String errorMsg = e.getClass().getName() + ": " + e.getMessage();
            if (e.getCause() != null) {
                errorMsg += " | Cause: " + e.getCause().getClass().getName() + ": " + e.getCause().getMessage();
            }
            return ResponseEntity.status(500).body(java.util.Map.of("message", errorMsg));
        }
    }

    @PutMapping("/{projectId}/close")
    @Operation(summary = "Close the project and mark as completed (Owner only)")
    public ResponseEntity<?> closeProject(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            workspaceService.closeProject(projectId, userDetails.getUsername());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            String errorMsg = e.getClass().getName() + ": " + e.getMessage();
            if (e.getCause() != null) {
                errorMsg += " | Cause: " + e.getCause().getClass().getName() + ": " + e.getCause().getMessage();
            }
            return ResponseEntity.status(500).body(java.util.Map.of("message", errorMsg));
        }
    }
}
