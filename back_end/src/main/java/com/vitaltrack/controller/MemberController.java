package com.vitaltrack.controller;

import com.vitaltrack.logic.MemberLogic;
import com.vitaltrack.model.MemberInfo;

import lombok.extern.log4j.Log4j2;

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
  public String register(@RequestBody MemberInfo member) {
    int result = memberLogic.registerMember(member);
    return result > 0 ? "회원가입 성공" : "회원가입 실패";
  }

  @PostMapping("/login")
  public MemberInfo login(@RequestBody MemberInfo loginRequest) {
    return memberLogic.login(loginRequest.getMemEmail(), loginRequest.getMemPw());
  }

  @GetMapping("/checkUser")
  public ResponseEntity<Boolean> checkUserExists(@RequestParam String email) {
    MemberInfo member = memberLogic.findByEmail(email);
    if (member != null) {
      return ResponseEntity.ok(true);
    }
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
  }
}
