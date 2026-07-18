package com.creatorhub.repository;

import com.creatorhub.entity.CollaborationProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollaborationProjectRepository extends JpaRepository<CollaborationProject, Long> {

    List<CollaborationProject> findByCreatorId(Long creatorId);

    List<CollaborationProject> findByStatus(CollaborationProject.ProjectStatus status);

    List<CollaborationProject> findByCategoriesId(Long categoryId);

    @Query("SELECT p FROM CollaborationProject p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<CollaborationProject> searchProjects(@Param("query") String query);

    @Query("SELECT p FROM CollaborationProject p JOIN p.requiredSkills s WHERE s.name = :skill")
    List<CollaborationProject> findByRequiredSkill(@Param("skill") String skill);
}
