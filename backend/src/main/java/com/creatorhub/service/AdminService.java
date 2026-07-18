package com.creatorhub.service;

import com.creatorhub.dto.user.UserProfileResponse;
import com.creatorhub.entity.User;
import com.creatorhub.exception.ResourceNotFoundException;
import com.creatorhub.repository.CollaborationProjectRepository;
import com.creatorhub.repository.CollaborationRequestRepository;
import com.creatorhub.repository.PortfolioRepository;
import com.creatorhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CollaborationProjectRepository projectRepository;
    private final CollaborationRequestRepository requestRepository;
    private final PortfolioRepository portfolioRepository;
    private final UserService userService;

    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userService::mapUserToProfile)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        userRepository.delete(user);
    }

    @Transactional
    public UserProfileResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
        return userService.mapUserToProfile(user);
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProjects", projectRepository.count());
        stats.put("totalPortfolios", portfolioRepository.count());
        stats.put("totalApplications", requestRepository.count());
        stats.put("openProjects", projectRepository.findByStatus(
            com.creatorhub.entity.CollaborationProject.ProjectStatus.OPEN).size());
        return stats;
    }
}
