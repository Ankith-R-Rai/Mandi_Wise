package com.mandiwise.farmer.service;

import com.mandiwise.common.exception.ResourceNotFoundException;
import com.mandiwise.entity.Farm;
import com.mandiwise.entity.FarmerProfile;
import com.mandiwise.entity.User;
import com.mandiwise.farmer.dto.FarmRequest;
import com.mandiwise.farmer.dto.FarmResponse;
import com.mandiwise.farmer.dto.FarmerProfileRequest;
import com.mandiwise.farmer.dto.FarmerProfileResponse;
import com.mandiwise.repository.FarmRepository;
import com.mandiwise.repository.FarmerProfileRepository;
import com.mandiwise.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FarmerProfileService {

    private final FarmerProfileRepository farmerProfileRepository;
    private final UserRepository userRepository;
    private final FarmRepository farmRepository;

    public FarmerProfileService(
            FarmerProfileRepository farmerProfileRepository,
            UserRepository userRepository,
            FarmRepository farmRepository) {
        this.farmerProfileRepository = farmerProfileRepository;
        this.userRepository = userRepository;
        this.farmRepository = farmRepository;
    }

    @Transactional(readOnly = true)
    public FarmerProfileResponse getProfile(String email) {
        User user = getUserByEmail(email);
        FarmerProfile profile = farmerProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    FarmerProfile newProfile = new FarmerProfile();
                    newProfile.setUser(user);
                    return farmerProfileRepository.save(newProfile);
                });

        return toProfileResponse(user, profile);
    }

    @Transactional
    public FarmerProfileResponse updateProfile(String email, FarmerProfileRequest request) {
        User user = getUserByEmail(email);
        FarmerProfile profile = farmerProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    FarmerProfile newProfile = new FarmerProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        if (request.getPreferredLanguage() != null) {
            profile.setPreferredLanguage(request.getPreferredLanguage().trim());
        }
        if (request.getDistrict() != null) {
            profile.setDistrict(request.getDistrict().trim());
        }
        if (request.getTaluk() != null) {
            profile.setTaluk(request.getTaluk().trim());
        }
        if (request.getVillage() != null) {
            profile.setVillage(request.getVillage().trim());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
            userRepository.save(user);
        }

        FarmerProfile saved = farmerProfileRepository.save(profile);
        return toProfileResponse(user, saved);
    }

    @Transactional
    public FarmResponse addFarm(String email, FarmRequest request) {
        User user = getUserByEmail(email);
        FarmerProfile profile = farmerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found for user: " + email));

        Farm farm = new Farm();
        farm.setFarmerProfile(profile);
        farm.setFarmName(request.getFarmName() != null ? request.getFarmName().trim() : null);
        farm.setDistrict(request.getDistrict().trim());
        farm.setTaluk(request.getTaluk() != null ? request.getTaluk().trim() : null);
        farm.setVillage(request.getVillage() != null ? request.getVillage().trim() : null);
        farm.setLandArea(request.getLandArea());
        farm.setLandAreaUnit(request.getLandAreaUnit() != null ? request.getLandAreaUnit().trim() : "ACRES");
        farm.setLatitude(request.getLatitude());
        farm.setLongitude(request.getLongitude());

        Farm saved = farmRepository.save(farm);
        return toFarmResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<FarmResponse> getFarms(String email) {
        User user = getUserByEmail(email);
        FarmerProfile profile = farmerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found for user: " + email));

        return farmRepository.findByFarmerProfileId(profile.getId()).stream()
                .map(this::toFarmResponse)
                .collect(Collectors.toList());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private FarmerProfileResponse toProfileResponse(User user, FarmerProfile profile) {
        FarmerProfileResponse response = new FarmerProfileResponse();
        response.setId(profile.getId());
        response.setUserId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setPreferredLanguage(profile.getPreferredLanguage());
        response.setDistrict(profile.getDistrict());
        response.setTaluk(profile.getTaluk());
        response.setVillage(profile.getVillage());
        response.setCreatedAt(profile.getCreatedAt());

        List<Farm> farms = farmRepository.findByFarmerProfileId(profile.getId());
        response.setFarms(farms.stream().map(this::toFarmResponse).collect(Collectors.toList()));

        return response;
    }

    private FarmResponse toFarmResponse(Farm farm) {
        FarmResponse response = new FarmResponse();
        response.setId(farm.getId());
        response.setFarmName(farm.getFarmName());
        response.setDistrict(farm.getDistrict());
        response.setTaluk(farm.getTaluk());
        response.setVillage(farm.getVillage());
        response.setLandArea(farm.getLandArea());
        response.setLandAreaUnit(farm.getLandAreaUnit());
        response.setLatitude(farm.getLatitude());
        response.setLongitude(farm.getLongitude());
        response.setCreatedAt(farm.getCreatedAt());
        return response;
    }
}
