package com.mandiwise.auth;

import com.mandiwise.auth.dto.AuthResponse;
import com.mandiwise.auth.dto.RegisterRequest;
import com.mandiwise.auth.service.AuthService;
import com.mandiwise.common.exception.EmailAlreadyExistsException;
import com.mandiwise.entity.FarmerProfile;
import com.mandiwise.entity.Role;
import com.mandiwise.entity.User;
import com.mandiwise.repository.FarmerProfileRepository;
import com.mandiwise.repository.RoleRepository;
import com.mandiwise.repository.UserRepository;
import com.mandiwise.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private FarmerProfileRepository farmerProfileRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("farmer@kolar.in", "SecurePass123!", "Ramesh Gowda");
        registerRequest.setDistrict("Kolar");
        registerRequest.setTaluk("Kolar Taluk");
    }

    @Test
    @DisplayName("Should register new farmer successfully and return JWT auth response")
    void testRegister_Success() {
        when(userRepository.existsByEmail("farmer@kolar.in")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPasswordHash");

        Role role = new Role("ROLE_FARMER", "Farmer role");
        role.setId(UUID.randomUUID());
        when(roleRepository.findByName("ROLE_FARMER")).thenReturn(Optional.of(role));

        User savedUser = new User("farmer@kolar.in", "$2a$10$encodedPasswordHash", "Ramesh Gowda");
        savedUser.setId(UUID.randomUUID());
        savedUser.addRole(role);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        FarmerProfile savedProfile = new FarmerProfile(savedUser, "Kolar", "Kolar Taluk", null);
        savedProfile.setId(UUID.randomUUID());
        when(farmerProfileRepository.save(any(FarmerProfile.class))).thenReturn(savedProfile);

        when(tokenProvider.generateToken(anyString(), any(UUID.class), any())).thenReturn("mocked.jwt.token");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getToken());
        assertEquals("farmer@kolar.in", response.getEmail());
        assertEquals("Ramesh Gowda", response.getFullName());
        assertTrue(response.getRoles().contains("ROLE_FARMER"));

        verify(userRepository, times(1)).save(any(User.class));
        verify(farmerProfileRepository, times(1)).save(any(FarmerProfile.class));
    }

    @Test
    @DisplayName("Should throw EmailAlreadyExistsException when email is already registered")
    void testRegister_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail("farmer@kolar.in")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }
}
