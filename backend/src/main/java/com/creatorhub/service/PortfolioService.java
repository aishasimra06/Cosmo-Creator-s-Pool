package com.creatorhub.service;

import com.creatorhub.dto.portfolio.PortfolioRequest;
import com.creatorhub.dto.portfolio.PortfolioResponse;
import com.creatorhub.entity.Portfolio;
import com.creatorhub.entity.User;
import com.creatorhub.exception.ResourceNotFoundException;
import com.creatorhub.exception.UnauthorizedException;
import com.creatorhub.repository.PortfolioRepository;
import com.creatorhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public List<PortfolioResponse> getAllPortfolios() {
        return portfolioRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PortfolioResponse> getUserPortfolios(Long userId) {
        return portfolioRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PortfolioResponse getPortfolioById(Long id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "id", id));
        return mapToResponse(portfolio);
    }

    @Transactional
    public PortfolioResponse createPortfolio(PortfolioRequest request, MultipartFile thumbnail, String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        Portfolio portfolio = Portfolio.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .projectUrl(request.getProjectUrl())
                .githubUrl(request.getGithubUrl())
                .tools(request.getTools())
                .category(request.getCategory())
                .user(user)
                .build();

        if (thumbnail != null && !thumbnail.isEmpty()) {
            String thumbnailUrl = cloudinaryService.uploadImage(thumbnail, "portfolios");
            portfolio.setThumbnailUrl(thumbnailUrl);
        }

        portfolioRepository.save(portfolio);
        log.info("Portfolio created by user: {}", currentUserEmail);
        return mapToResponse(portfolio);
    }

    @Transactional
    public PortfolioResponse updatePortfolio(Long id, PortfolioRequest request, MultipartFile thumbnail, String currentUserEmail) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "id", id));

        if (!portfolio.getUser().getEmail().equals(currentUserEmail)) {
            throw new UnauthorizedException("You can only edit your own portfolio items");
        }

        if (request.getTitle() != null) portfolio.setTitle(request.getTitle());
        if (request.getDescription() != null) portfolio.setDescription(request.getDescription());
        if (request.getProjectUrl() != null) portfolio.setProjectUrl(request.getProjectUrl());
        if (request.getGithubUrl() != null) portfolio.setGithubUrl(request.getGithubUrl());
        if (request.getTools() != null) portfolio.setTools(request.getTools());
        if (request.getCategory() != null) portfolio.setCategory(request.getCategory());

        if (thumbnail != null && !thumbnail.isEmpty()) {
            String thumbnailUrl = cloudinaryService.uploadImage(thumbnail, "portfolios");
            portfolio.setThumbnailUrl(thumbnailUrl);
        }

        portfolioRepository.save(portfolio);
        return mapToResponse(portfolio);
    }

    @Transactional
    public void deletePortfolio(Long id, String currentUserEmail) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "id", id));

        if (!portfolio.getUser().getEmail().equals(currentUserEmail)) {
            throw new UnauthorizedException("You can only delete your own portfolio items");
        }

        portfolioRepository.delete(portfolio);
    }

    private PortfolioResponse mapToResponse(Portfolio p) {
        return PortfolioResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .thumbnailUrl(p.getThumbnailUrl())
                .projectUrl(p.getProjectUrl())
                .githubUrl(p.getGithubUrl())
                .tools(p.getTools())
                .category(p.getCategory())
                .userId(p.getUser().getId())
                .username(p.getUser().getUsername())
                .userAvatarUrl(p.getUser().getAvatarUrl())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
