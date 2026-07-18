package com.creatorhub.service;

import com.creatorhub.dto.user.UpdateProfileRequest;
import com.creatorhub.dto.user.UserProfileResponse;
import com.creatorhub.entity.Skill;
import com.creatorhub.entity.User;
import com.creatorhub.exception.ResourceNotFoundException;
import com.creatorhub.exception.UnauthorizedException;
import com.creatorhub.repository.SkillRepository;
import com.creatorhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final CloudinaryService cloudinaryService;

    public UserProfileResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToProfile(user);
    }

    public UserProfileResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return mapToProfile(user);
    }

    public UserProfileResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapToProfile(user);
    }

    public UserProfileResponse mapUserToProfile(User user) {
        return mapToProfile(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request, String currentUserEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        if (!user.getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only update your own profile");
        }

        if (request.getName() != null) user.setName(request.getName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getGithubUrl() != null) user.setGithubUrl(request.getGithubUrl());
        if (request.getLinkedinUrl() != null) user.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getInstagramUrl() != null) user.setInstagramUrl(request.getInstagramUrl());
        if (request.getWebsiteUrl() != null) user.setWebsiteUrl(request.getWebsiteUrl());
        if (request.getTitle() != null) user.setTitle(request.getTitle());
        if (request.getLocation() != null) user.setLocation(request.getLocation());
        if (request.getExperienceLevel() != null) user.setExperienceLevel(request.getExperienceLevel());
        if (request.getIsAvailable() != null) user.setIsAvailable(request.getIsAvailable());

        if (request.getSkills() != null) {
            Set<Skill> skills = new HashSet<>();
            for (String skillName : request.getSkills()) {
                Skill skill = skillRepository.findByNameIgnoreCase(skillName)
                        .orElseGet(() -> skillRepository.save(
                            Skill.builder().name(skillName).build()
                        ));
                skills.add(skill);
            }
            user.setSkills(skills);
        }

        userRepository.save(user);
        return mapToProfile(user);
    }

    @Transactional
    public String uploadAvatar(Long userId, MultipartFile file, String currentUserEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        if (!user.getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only update your own avatar");
        }

        String avatarUrl = cloudinaryService.uploadImage(file, "avatars");
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
        return avatarUrl;
    }

    @Transactional
    public String uploadResume(Long userId, MultipartFile file, String currentUserEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        if (!user.getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only update your own resume");
        }

        String resumeUrl = cloudinaryService.uploadFile(file, "resumes");
        user.setResumeUrl(resumeUrl);
        userRepository.save(user);
        return resumeUrl;
    }

    public List<UserProfileResponse> searchUsers(String query) {
        return userRepository.searchUsers(query).stream()
                .map(this::mapToProfile)
                .collect(Collectors.toList());
    }

    public List<UserProfileResponse> getAllCreators() {
        return userRepository.findAll().stream()
                .map(this::mapToProfile)
                .collect(Collectors.toList());
    }

    private UserProfileResponse mapToProfile(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .githubUrl(user.getGithubUrl())
                .linkedinUrl(user.getLinkedinUrl())
                .instagramUrl(user.getInstagramUrl())
                .websiteUrl(user.getWebsiteUrl())
                .title(user.getTitle())
                .location(user.getLocation())
                .experienceLevel(user.getExperienceLevel())
                .resumeUrl(user.getResumeUrl())
                .completedCollaborations(user.getCompletedCollaborations())
                .reviewsCount(user.getReviewsCount())
                .creatorRating(user.getCreatorRating())
                .isAvailable(user.getIsAvailable())
                .skills(user.getSkills().stream().map(Skill::getName).collect(Collectors.toList()))
                .roles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList()))
                .portfolioCount(user.getPortfolios() != null ? user.getPortfolios().size() : 0)
                .projectCount(user.getProjects() != null ? user.getProjects().size() : 0)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
