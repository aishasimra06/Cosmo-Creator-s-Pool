package com.creatorhub.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String folder) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", "creator-hub/" + folder,
                    "resource_type", "image",
                    "quality", "auto",
                    "fetch_format", "auto"
                )
            );
            return (String) result.get("secure_url");
        } catch (IOException e) {
            log.error("Error uploading image to Cloudinary: {}", e.getMessage());
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    public String uploadFile(MultipartFile file, String folder) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", "creator-hub/" + folder,
                    "resource_type", "raw"
                )
            );
            return (String) result.get("secure_url");
        } catch (IOException e) {
            log.error("Error uploading file to Cloudinary: {}", e.getMessage());
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.error("Error deleting image from Cloudinary: {}", e.getMessage());
        }
    }

    public String extractPublicId(String imageUrl) {
        // Extract public_id from URL like:
        // https://res.cloudinary.com/{cloud}/image/upload/v{version}/{folder}/{public_id}.{ext}
        if (imageUrl == null || imageUrl.isEmpty()) return null;
        String[] parts = imageUrl.split("/");
        String lastPart = parts[parts.length - 1];
        String publicId = lastPart.substring(0, lastPart.lastIndexOf('.'));
        String folder = parts[parts.length - 2];
        return folder + "/" + publicId;
    }
}
