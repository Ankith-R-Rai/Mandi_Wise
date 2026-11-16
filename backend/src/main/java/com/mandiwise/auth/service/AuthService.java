package com.mandiwise.auth.service;

import com.mandiwise.auth.dto.AuthResponse;
import com.mandiwise.auth.dto.LoginRequest;
import com.mandiwise.auth.dto.RegisterRequest;
import com.mandiwise.common.exception.EmailAlreadyExistsException;
import com.mandiwise.common.exception.ResourceNotFoundException;
import com.mandiwise.entity.AccountStatus;
import com.mandiwise.entity.FarmerProfile;
import com.mandiwise.entity.Role;
import com.mandiwise.entity.User;
import com.mandiwise.repository.FarmerProfileRepository;
import com.mandiwise.repository.RoleRepository;
import com.mandiwise.repository.UserRepository;
import com.mandiwise.security.CustomUserDetails;
import com.mandiwise.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            FarmerProfileRepository farmerProfileRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.farmerProfileRepository = farmerProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyExistsException("An account with email " + normalizedEmail + " already exists.");
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null);
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setEmailVerified(false);

        // Determine Role
        String targetRoleName = (request.getRole() != null && !request.getRole().isBlank())
                ? request.getRole().trim().toUpperCase()
                : "ROLE_FARMER";
        if (!targetRoleName.startsWith("ROLE_")) {
            targetRoleName = "ROLE_" + targetRoleName;
        }

        final String finalRoleName = targetRoleName;
        Role role = roleRepository.findByName(finalRoleName)
                .orElseGet(() -> roleRepository.save(new Role(finalRoleName, "Application user role")));
        user.addRole(role);

        User savedUser = userRepository.save(user);

        // Auto-provision initial farmer profile
        FarmerProfile profile = new FarmerProfile();
        profile.setUser(savedUser);
        profile.setPreferredLanguage(request.getPreferredLanguage() != null ? request.getPreferredLanguage() : "EN");
        profile.setDistrict(request.getDistrict());
        profile.setTaluk(request.getTaluk());
        profile.setVillage(request.getVillage());

        FarmerProfile savedProfile = farmerProfileRepository.save(profile);
        savedUser.setFarmerProfile(savedProfile);

        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String token = tokenProvider.generateToken(savedUser.getEmail(), savedUser.getId(), userDetails.getAuthorities());

        return buildAuthResponse(savedUser, savedProfile, token);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + normalizedEmail));

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        FarmerProfile profile = farmerProfileRepository.findByUserId(user.getId()).orElse(null);

        String token = tokenProvider.generateToken(user.getEmail(), user.getId(), userDetails.getAuthorities());

        return buildAuthResponse(user, profile, token);
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + normalizedEmail));

        FarmerProfile profile = farmerProfileRepository.findByUserId(user.getId()).orElse(null);
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = tokenProvider.generateToken(user.getEmail(), user.getId(), userDetails.getAuthorities());

        return buildAuthResponse(user, profile, token);
    }

    private AuthResponse buildAuthResponse(User user, FarmerProfile profile, String token) {
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setTokenType("Bearer");
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhoneNumber(user.getPhoneNumber());

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        response.setRoles(roles);

        if (profile != null) {
            response.setFarmerProfileId(profile.getId());
            response.setDistrict(profile.getDistrict());
        }

        return response;
    }
}
