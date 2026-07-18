package com.creatorhub.dto.user;

import lombok.Data;

import java.util.List;

@Data
public class UpdateProfileRequest {
    private String name;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
    private String instagramUrl;
    private String websiteUrl;
    private String title;
    private String location;
    private String experienceLevel;
    private Boolean isAvailable;
    private List<String> skills;
}
