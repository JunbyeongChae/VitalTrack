package com.vitaltrack.controller;

import com.vitaltrack.logic.MemberLogic;
import com.vitaltrack.model.MemberInfo;
import com.vitaltrack.util.JwtUtil;

import lombok.extern.log4j.Log4j2;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

@Log4j2
@RestController
@RequestMapping("/api/auth")
public class MemberController {
  @Autowired
  private MemberLogic memberLogic;
  @Autowired
  private JwtUtil jwtUtil;

  @PostMapping("/signup")
  public ResponseEntity<?> register(@RequestBody MemberInfo member) {
    try {
      int result = memberLogic.registerMember(member);
      if (result > 0) {
        // 반드시 200 OK로 명확히 반환
        return ResponseEntity.ok(Map.of("status", "success", "message", "회원가입이 완료되었습니다."));
      } else {
        // 실패 시에는 400으로 반환
        return ResponseEntity.status(400).body(Map.of("status", "error", "message", "회원가입에 실패했습니다."));
      }
    } catch (IllegalArgumentException e) {
      // 예외가 발생하면 400으로 명확히 반환
      return ResponseEntity.status(400).body(Map.of("status", "error", "message", e.getMessage()));
    }
  }

  // 로그인 API
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody MemberInfo loginRequest) {
    try {
      MemberInfo member = memberLogic.login(loginRequest.getMemId(), loginRequest.getMemPw());

      // 비밀번호는 반환하지 않도록 null로 처리
      member.setMemPw(null);

      // JWT 토큰 생성
      String token = jwtUtil.generateToken(member.getMemId());

      // 토큰 + 사용자 정보 반환
      return ResponseEntity.ok(Map.of(
          "token", token,
          "user", member));

    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(Map.of("error", e.getMessage()));
    }
  }

  @PutMapping("/updateUser")
  public ResponseEntity<?> updateUser(@RequestBody MemberInfo member) {
    try {
      int updatedRows = memberLogic.updateUser(member);
      if (updatedRows > 0) {
        // ✅ JSON 형식으로 응답
        return ResponseEntity.ok(Map.of("status", "success", "message", "회원 정보가 업데이트되었습니다."));
      } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("status", "fail", "message", "회원 정보를 찾을 수 없습니다."));
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("status", "error", "message", "회원 정보 업데이트 실패: " + e.getMessage()));
    }
  }

  @PostMapping("/checkPassword")
  public ResponseEntity<?> checkPassword(@RequestBody Map<String, String> request) {
    String email = request.get("memEmail");
    String inputPw = request.get("memPw");

    MemberInfo member = memberLogic.findByEmail(email);
    if (member == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(Map.of("success", false, "message", "존재하지 않는 이메일입니다."));
    }

    String storedPw = member.getMemPw();
    boolean isPlainText = !storedPw.startsWith("$2a$");
    boolean match = isPlainText ? storedPw.equals(inputPw) : BCrypt.checkpw(inputPw, storedPw);

    if (!match) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of("success", false, "message", "비밀번호가 일치하지 않습니다."));
    }

    if (isPlainText) {
      String hashedPw = BCrypt.hashpw(inputPw, BCrypt.gensalt());
      member.setMemPw(hashedPw);
      memberLogic.updateUser(member); // 암호화 후 저장
    }

    return ResponseEntity.ok(Map.of("success", true));
  }

  @DeleteMapping("/deleteUser")
  public ResponseEntity<?> deleteUser(@RequestBody Map<String, String> request) {
    log.info("회원 탈퇴 요청: " + request);
    String email = request.get("memEmail");
    log.info("회원 탈퇴 이메일: " + email);

    try {
      int deleted = memberLogic.deleteUser(email);
      if (deleted > 0) {
        return ResponseEntity.ok(Map.of("success", true, "message", "회원 탈퇴 성공"));
      } else {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("success", false, "message", "회원 탈퇴 실패"));
      }
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("success", false, "message", "회원 탈퇴 중 서버 오류 발생"));
    }
  }

  // 이메일로 회원 조회 및 중복 확인 (로그인용)
  @GetMapping("/getUserByEmail")
  public ResponseEntity<?> getUserByEmail(@RequestParam("email") String email) {
    try {
      log.info("이메일로 회원 조회 시도: " + email);
      MemberInfo member = memberLogic.findByEmail(email);
      if (member == null) {
        log.error("회원 정보를 찾을 수 없습니다. 이메일: " + email);
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("exists", false, "message", "회원 정보를 찾을 수 없습니다."));
      }
      log.info("회원 정보 조회 성공: " + member);
      return ResponseEntity.ok(Map.of("exists", true, "member", member));
    } catch (Exception e) {
      log.error("서버 오류 발생: " + e.getMessage(), e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("exists", false, "message", "서버 오류 발생: " + e.getMessage()));
    }
  }

  // 아이디 중복 확인 API
  @GetMapping("/checkId")
  public ResponseEntity<?> checkId(@RequestParam("memId") String memId) {
    boolean exists = memberLogic.findById(memId) != null;
    return ResponseEntity.ok(Map.of("exists", exists));
  }

  // 체중 변화 데이터 조회 API
  @GetMapping("/getWeightChanges")
  public ResponseEntity<?> getWeightChanges(@RequestParam("memNo") Integer memNo) {
    try {
      List<Map<String, Object>> weightChanges = memberLogic.getWeightChanges(memNo);
      return ResponseEntity.ok(weightChanges);
    } catch (Exception e) {
      log.error("체중 변화 데이터 조회 실패: ", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("데이터 조회 실패");
    }
  }

  // 구글 로그인용 JWT 발급 API 추가
  @PostMapping("/oauth-login")
  public ResponseEntity<?> oauthLogin(@RequestBody Map<String, String> request) {
    String email = request.get("memEmail");
    if (email == null || email.isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("error", "이메일이 필요합니다."));
    }

    MemberInfo member = memberLogic.findByEmail(email);
    if (member == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(Map.of("error", "해당 이메일로 등록된 사용자가 없습니다."));
    }

    member.setMemPw(null); // 비밀번호 제거
    String token = jwtUtil.generateToken(member.getMemId());

    return ResponseEntity.ok(Map.of(
        "token", token,
        "user", member));
  }

}