package com.creatorhub.controller;

import com.creatorhub.dto.portfolio.PortfolioRequest;
import com.creatorhub.dto.portfolio.PortfolioResponse;
import com.creatorhub.service.PortfolioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
@Tag(name = "Portfolios", description = "Portfolio management")
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping
    @Operation(summary = "Get all portfolios")
    public ResponseEntity<List<PortfolioResponse>> getAllPortfolios() {
        return ResponseEntity.ok(portfolioService.getAllPortfolios());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get portfolio by ID")
    public ResponseEntity<PortfolioResponse> getPortfolioById(@PathVariable Long id) {
        return ResponseEntity.ok(portfolioService.getPortfolioById(id));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get portfolios by user ID")
    public ResponseEntity<List<PortfolioResponse>> getUserPortfolios(@PathVariable Long userId) {
        return ResponseEntity.ok(portfolioService.getUserPortfolios(userId));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create new portfolio item")
    public ResponseEntity<PortfolioResponse> createPortfolio(
            @RequestPart("data") @Valid PortfolioRequest request,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(portfolioService.createPortfolio(request, thumbnail, userDetails.getUsername()));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update portfolio item")
    public ResponseEntity<PortfolioResponse> updatePortfolio(
            @PathVariable Long id,
            @RequestPart("data") PortfolioRequest request,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(portfolioService.updatePortfolio(id, request, thumbnail, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete portfolio item")
    public ResponseEntity<Void> deletePortfolio(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        portfolioService.deletePortfolio(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
