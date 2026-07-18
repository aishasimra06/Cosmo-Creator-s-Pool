package com.creatorhub.service;

import com.creatorhub.dto.project.ProjectResponse;
import com.creatorhub.entity.Bookmark;
import com.creatorhub.entity.CollaborationProject;
import com.creatorhub.entity.User;
import com.creatorhub.exception.DuplicateResourceException;
import com.creatorhub.exception.ResourceNotFoundException;
import com.creatorhub.repository.BookmarkRepository;
import com.creatorhub.repository.CollaborationProjectRepository;
import com.creatorhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final CollaborationProjectRepository projectRepository;
    private final ProjectService projectService;

    public List<ProjectResponse> getUserBookmarks(String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        return bookmarkRepository.findByUserId(user.getId()).stream()
                .filter(b -> b.getProject() != null)
                .map(b -> projectService.getProjectById(b.getProject().getId()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void addBookmark(Long projectId, String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        CollaborationProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        if (bookmarkRepository.existsByUserIdAndProjectId(user.getId(), projectId)) {
            throw new DuplicateResourceException("Project is already bookmarked");
        }

        Bookmark bookmark = Bookmark.builder()
                .user(user)
                .project(project)
                .build();
        bookmarkRepository.save(bookmark);
    }

    @Transactional
    public void removeBookmark(Long projectId, String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        if (!bookmarkRepository.existsByUserIdAndProjectId(user.getId(), projectId)) {
            throw new ResourceNotFoundException("Bookmark not found for project: " + projectId);
        }

        bookmarkRepository.deleteByUserIdAndProjectId(user.getId(), projectId);
    }
}
