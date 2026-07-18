package com.creatorhub.controller;

import com.creatorhub.dto.project.ProjectResponse;
import com.creatorhub.service.BookmarkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
@Tag(name = "Bookmarks", description = "Save and manage bookmarked projects")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @GetMapping
    @Operation(summary = "Get all bookmarked projects for current user")
    public ResponseEntity<List<ProjectResponse>> getBookmarks(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookmarkService.getUserBookmarks(userDetails.getUsername()));
    }

    @PostMapping("/{projectId}")
    @Operation(summary = "Bookmark a project")
    public ResponseEntity<Map<String, String>> addBookmark(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserDetails userDetails) {
        bookmarkService.addBookmark(projectId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Project bookmarked successfully"));
    }

    @DeleteMapping("/{projectId}")
    @Operation(summary = "Remove a bookmark")
    public ResponseEntity<Void> removeBookmark(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserDetails userDetails) {
        bookmarkService.removeBookmark(projectId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
