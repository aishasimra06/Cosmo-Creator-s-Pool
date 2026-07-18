package com.creatorhub.repository;

import com.creatorhub.entity.ProjectCollaborator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectCollaboratorRepository extends JpaRepository<ProjectCollaborator, Long> {
    List<ProjectCollaborator> findByProjectId(Long projectId);
    List<ProjectCollaborator> findByUserId(Long userId);
    boolean existsByProjectIdAndUserId(Long projectId, Long userId);
}
