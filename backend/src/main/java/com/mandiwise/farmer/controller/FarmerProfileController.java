package com.mandiwise.farmer.controller;

import com.mandiwise.common.dto.ApiResponse;
import com.mandiwise.farmer.dto.FarmRequest;
import com.mandiwise.farmer.dto.FarmResponse;
import com.mandiwise.farmer.dto.FarmerProfileRequest;
import com.mandiwise.farmer.dto.FarmerProfileResponse;
import com.mandiwise.farmer.service.FarmerProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/farmers")
@PreAuthorize("hasRole('FARMER') or hasRole('ADMIN')")
public class FarmerProfileController {

    private final FarmerProfileService farmerProfileService;

    public FarmerProfileController(FarmerProfileService farmerProfileService) {
        this.farmerProfileService = farmerProfileService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<FarmerProfileResponse>> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        FarmerProfileResponse response = farmerProfileService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<FarmerProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody FarmerProfileRequest request) {
        FarmerProfileResponse response = farmerProfileService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PostMapping("/farms")
    public ResponseEntity<ApiResponse<FarmResponse>> addFarm(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody FarmRequest request) {
        FarmResponse response = farmerProfileService.addFarm(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Farm registered successfully", response));
    }

    @GetMapping("/farms")
    public ResponseEntity<ApiResponse<List<FarmResponse>>> getFarms(@AuthenticationPrincipal UserDetails userDetails) {
        List<FarmResponse> response = farmerProfileService.getFarms(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
