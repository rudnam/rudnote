package com.rudnam.note.service;

import com.rudnam.note.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private static final String SECRET = "rudnamrudnamrudnamrudnamrudnamrudnamrudnamrudnamrudnamrudnamrudnamrudnam";
    private static final int expirationSeconds = 60 * 60;
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId().toString())
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plusSeconds(expirationSeconds)))
                .signWith(key)
                .compact();
    }

    public UUID validateTokenAndGetUserId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return UUID.fromString(claims.getSubject());
    }

    public int getExpirationSeconds() {
        return expirationSeconds;
    }


}
