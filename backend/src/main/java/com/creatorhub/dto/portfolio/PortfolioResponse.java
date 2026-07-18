package com.creatorhub.dto.portfolio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PortfolioResponse {
    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String projectUrl;
    private String githubUrl;
    private String tools;
    private String category;
    private Long userId;
    private String username;
    private String userAvatarUrl;
    private LocalDateTime createdAt;
}
