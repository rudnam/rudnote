package com.rudnam.note.controller;

import com.rudnam.note.models.User;
import com.rudnam.note.repository.UserRepository;
import com.rudnam.note.service.JwtService;
import com.rudnam.note.service.PasswordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;



@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final PasswordService passwordService;
    private final JwtService jwtService;

    public UserController(UserRepository userRepository, PasswordService passwordService,  JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
        }
        if (userRepository.findByUsername(request.username).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already registered");
        }

        User user = new User();
        user.setUsername(request.username);
        user.setEmail(request.email);
        user.setPasswordHash(passwordService.hash(request.password));
        user.setDisplayName(request.username);
        user.setCreatedAt(Instant.now());

        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        User user = userOpt.get();
        boolean valid = passwordService.verify(request.password, user.getPasswordHash());
        if (!valid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        if (user.isDeactivated()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account is deactivated");
        }

        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new TokenResponse(token));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new UserProfileDTO(
                user.getUsername(),
                user.getDisplayName(),
                user.getBio(),
                user.getAvatarUrl(),
                user.getWebsiteUrl(),
                user.getLocation()
        ));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateProfileRequest request
    ) {
        user.setEmail(request.email);
        user.setUsername(request.username);
        user.setDisplayName(request.displayName);
        user.setBio(request.bio);
        user.setAvatarUrl(request.avatarUrl);
        user.setWebsiteUrl(request.websiteUrl);
        user.setLocation(request.location);

        userRepository.save(user);
        return ResponseEntity.ok("Profile updated");
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody PasswordChangeRequest request
    ) {
        if (!passwordService.verify(request.oldPassword, user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Old password incorrect");
        }

        user.setPasswordHash(passwordService.hash(request.newPassword));
        userRepository.save(user);
        return ResponseEntity.ok("Password changed");
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deactivateAccount(@AuthenticationPrincipal User user) {
        user.setDeactivated(true);
        userRepository.save(user);
        return ResponseEntity.ok("Account deactivated");
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Query cannot be empty");
        }

        List<User> users = userRepository
                .searchByUsernameOrDisplayName(query);

        List<UserProfileDTO> result = users.stream()
                .map(user -> new UserProfileDTO(
                        user.getUsername(),
                        user.getDisplayName(),
                        user.getBio(),
                        user.getAvatarUrl(),
                        user.getWebsiteUrl(),
                        user.getLocation()))
                .toList();

        return ResponseEntity.ok(result);
    }


    @GetMapping("/@{username}")
    public ResponseEntity<?> getPublicProfile(@PathVariable String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty() || userOpt.get().isDeactivated()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        UserProfileDTO profile = new UserProfileDTO(
                user.getUsername(),
                user.getDisplayName(),
                user.getBio(),
                user.getAvatarUrl(),
                user.getWebsiteUrl(),
                user.getLocation()
        );

        return ResponseEntity.ok(profile);
    }

    public record TokenResponse(String token) {}
    public record RegisterRequest(String username, String email, String password) {}
    public record LoginRequest(String email, String password) {}
    public record UpdateProfileRequest(
            String email,
            String username,
            String displayName,
            String bio,
            String avatarUrl,
            String websiteUrl,
            String location
    ) {}
    public record PasswordChangeRequest(String oldPassword, String newPassword) {}
    public record UserProfileDTO(
            String username,
            String displayName,
            String bio,
            String avatarUrl,
            String websiteUrl,
            String location
    ) {}
}
