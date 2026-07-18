package com.creatorhub.dto.portfolio;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PortfolioRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    private String description;
    private String projectUrl;
    private String githubUrl;
    private String tools;
    private String category;
}
