package com.vitaltrack.controller;

import com.vitaltrack.logic.MemberLogic;
import com.vitaltrack.model.MemberInfo;

import lombok.extern.log4j.Log4j2;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

@Log4j2
@RestController
@RequestMapping("/api/auth")
public class MemberController {
  @Autowired
  private MemberLogic memberLogic;

  @PostMapping("/signup")
  public ResponseEntity<?> register(@RequestBody MemberInfo member) {
    try {
      int result = memberLogic.registerMember(member);
      if (result > 0) {
        // ✅ 반드시 200 OK로 명확히 반환
        return ResponseEntity.ok(Map.of("status", "success", "message", "회원가입 성공"));
      } else {
        // ✅ 실패 시에는 400으로 반환
        return ResponseEntity.status(400).body(Map.of("status", "error", "message", "회원가입 실패"));
      }
    } catch (IllegalArgumentException e) {
      // ✅ 예외가 발생하면 400으로 명확히 반환
      return ResponseEntity.status(400).body(Map.of("status", "error", "message", e.getMessage()));
    }
  }

  // 로그인 API
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody MemberInfo loginRequest) {
    try {
      MemberInfo member = memberLogic.login(loginRequest.getMemEmail(), loginRequest.getMemPw());

      // 비밀번호는 반환하지 않도록 null로 처리
      member.setMemPw(null);

      return ResponseEntity.ok(member);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(Map.of("error", e.getMessage()));
    }
  }

  @GetMapping("/checkUser")
  public ResponseEntity<Boolean> checkUserExists(@RequestParam String email) {
    log.info("구글 로그인 이메일: " + email);
    MemberInfo member = memberLogic.findByEmail(email);

    if (member != null) {
      return ResponseEntity.ok(true);
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
    }
  }

  // 이메일로 사용자 조회 API
  @GetMapping("/getUserByEmail")
  public ResponseEntity<?> getUserByEmail(@RequestParam("email") String email) {
    MemberInfo member = memberLogic.findByEmail(email);

    if (member != null) {
      // 비밀번호는 응답에서 제외
      member.setMemPw(null);
      
      return ResponseEntity.ok(member);
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(Map.of("error", "사용자를 찾을 수 없습니다."));
    }
  }
}