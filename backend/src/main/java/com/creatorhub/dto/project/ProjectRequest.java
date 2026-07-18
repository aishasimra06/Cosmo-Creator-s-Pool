package com.creatorhub.dto.project;

import com.creatorhub.entity.CollaborationProject;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProjectRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private Integer teamSize;
    private LocalDate deadline;
    private List<Long> categoryIds;
    private List<String> requiredSkills;
    private CollaborationProject.ProjectStatus status;
}
