package com.vitaltrack.util;

import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.security.Key;

@Component
public class JwtUtil {
  private final String secret = "ThisIsASecretKeyForJWTAuthenticationVitalTrackApp2025"; // 256bit 이상 권장
  private final long expirationTime = 1000 * 60 * 60; // 1시간

  private final Key key = Keys.hmacShaKeyFor(secret.getBytes());

  // 토큰 생성
  public String generateToken(String username) {
    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  // 토큰에서 사용자 이름 추출
  public String extractUsername(String token) {
    return getClaims(token).getSubject();
  }

  // 토큰 유효성 검증
  public boolean isTokenValid(String token) {
    try {
      getClaims(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  // Claims 파싱
  private Claims getClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody();
  }
}
