package com.rudnam.note.controller;

import com.rudnam.note.models.User;
import com.rudnam.note.repository.UserRepository;
import com.rudnam.note.service.JwtService;
import com.rudnam.note.service.PasswordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
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

        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(token);
    }

    public record RegisterRequest(String username, String email, String password) {}
    public record LoginRequest(String email, String password) {}
}
