package com.creatorhub.dto.workspace;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CollaboratorResponse {
    private Long userId;
    private String name;
    private String username;
    private String avatarUrl;
    private String role; // "OWNER" or the requested role (e.g. "UI/UX Designer")
    private String bio;
}
