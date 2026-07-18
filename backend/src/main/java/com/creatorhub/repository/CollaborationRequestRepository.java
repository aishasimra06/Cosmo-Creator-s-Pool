package com.creatorhub.repository;

import com.creatorhub.entity.CollaborationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollaborationRequestRepository extends JpaRepository<CollaborationRequest, Long> {

    List<CollaborationRequest> findByProjectId(Long projectId);

    List<CollaborationRequest> findByApplicantId(Long applicantId);

    Optional<CollaborationRequest> findByProjectIdAndApplicantId(Long projectId, Long applicantId);

    boolean existsByProjectIdAndApplicantId(Long projectId, Long applicantId);

    boolean existsByProjectIdAndApplicantIdAndStatus(Long projectId, Long applicantId, CollaborationRequest.RequestStatus status);

    List<CollaborationRequest> findByProjectIdAndStatus(Long projectId, CollaborationRequest.RequestStatus status);
}
