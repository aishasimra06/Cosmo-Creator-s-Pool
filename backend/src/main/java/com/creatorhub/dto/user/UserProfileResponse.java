package com.creatorhub.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String name;
    private String username;
    private String email;
    private String bio;
    private String avatarUrl;
    private String githubUrl;
    private String linkedinUrl;
    private String instagramUrl;
    private String websiteUrl;
    private String title;
    private String location;
    private String experienceLevel;
    private String resumeUrl;
    private Integer completedCollaborations;
    private Integer reviewsCount;
    private Double creatorRating;
    private Boolean isAvailable;
    private List<String> skills;
    private List<String> roles;
    private Integer portfolioCount;
    private Integer projectCount;
    private LocalDateTime createdAt;
}
