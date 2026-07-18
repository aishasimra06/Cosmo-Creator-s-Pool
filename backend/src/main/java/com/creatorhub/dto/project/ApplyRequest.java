package com.creatorhub.dto.project;

import lombok.Data;

@Data
public class ApplyRequest {
    private String message;
    private String requestedRole;
    private String portfolioLink;
}
