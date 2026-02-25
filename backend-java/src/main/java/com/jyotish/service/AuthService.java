package com.jyotish.service;

import com.jyotish.model.User;
import com.jyotish.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Map<String, Object> register(String email, String username, String password, String fullName) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already taken");
        }

        User user = User.builder()
                .email(email)
                .username(username)
                .passwordHash(passwordEncoder.encode(password))
                .fullName(fullName)
                .role("user")
                .build();

        user = userRepository.save(user);
        log.info("New user registered: {} ({})", username, email);

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        return Map.of(
                "access_token", accessToken,
                "refresh_token", refreshToken,
                "token_type", "Bearer",
                "user", buildUserResponse(user)
        );
    }

    public Map<String, Object> login(String identifier, String password) {
        User user = userRepository.findByEmailOrUsername(identifier)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!user.getIsActive()) {
            throw new IllegalArgumentException("Account is deactivated");
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        log.info("User logged in: {}", user.getEmail());

        return Map.of(
                "access_token", accessToken,
                "refresh_token", refreshToken,
                "token_type", "Bearer",
                "user", buildUserResponse(user)
        );
    }

    public Map<String, Object> refreshToken(String refreshToken) {
        if (!jwtService.isTokenValid(refreshToken)) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }

        String email = jwtService.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String newAccessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String newRefreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        return Map.of(
                "access_token", newAccessToken,
                "refresh_token", newRefreshToken,
                "token_type", "Bearer"
        );
    }

    public Map<String, Object> validateToken(String token) {
        if (!jwtService.isTokenValid(token)) {
            return Map.of("valid", false, "message", "Token invalid or expired");
        }
        String email = jwtService.extractEmail(token);
        String userId = jwtService.extractUserId(token);
        return Map.of("valid", true, "email", email, "user_id", userId);
    }

    private Map<String, Object> buildUserResponse(User user) {
        return Map.of(
                "id", user.getId().toString(),
                "email", user.getEmail(),
                "username", user.getUsername(),
                "full_name", user.getFullName() != null ? user.getFullName() : "",
                "role", user.getRole(),
                "is_verified", user.getIsVerified()
        );
    }
}
