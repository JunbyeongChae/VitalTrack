package com.vitaltrack.logic;

import com.vitaltrack.dao.MemberDao;
import com.vitaltrack.model.MemberInfo;

import lombok.extern.log4j.Log4j2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class MemberLogic {
  @Autowired
  private MemberDao memberDao;

  // 회원가입 처리
  public int registerMember(MemberInfo member) {
    // 비밀번호 null 체크
    if (member.getMemPw() == null || member.getMemPw().isEmpty()) {
      throw new IllegalArgumentException("비밀번호가 입력되지 않았습니다.");
    }

    // 비밀번호 확인 검증
    if (member.getConfirmPassword() == null || !member.getMemPw().equals(member.getConfirmPassword())) {
      throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    }

    // activityLevel 필수 값 검증
    if (member.getActivityLevel() == null || member.getActivityLevel().isEmpty()) {
      throw new IllegalArgumentException("일상 활동량을 선택해 주세요.");
    }

    if (member.getMemAge() == null || member.getMemAge() <= 0) {
      throw new IllegalArgumentException("유효한 나이를 입력해 주세요.");
    }

    // 중복 검사
    if (memberDao.findByEmail(member.getMemEmail()) != null) {
      throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
    }
    if (memberDao.findById(member.getMemId()) != null) {
      throw new IllegalArgumentException("이미 존재하는 ID입니다.");
    }

    // BMI 및 기초대사량 계산
    double bmi = calculateBMI(member.getMemHeight(), member.getMemWeight());
    int calorie = calculateCalories(member.getMemGen(), member.getMemAge(), member.getMemWeight(),
        member.getMemHeight());

    // 영양소 기준 계산 및 MemberInfo에 설정
    calculateStandardNutrition(member, calorie);

    // 계산된 값들을 MemberInfo에 저장
    member.setMemBmi(bmi);
    member.setMemKcal(calorie);

    // 회원 정보 저장
    return memberDao.insertMember(member);
  }

  // 로그인 검증
  public MemberInfo login(String email, String password) {
    MemberInfo member = memberDao.findByEmail(email);
    if (member == null) {
      throw new IllegalArgumentException("존재하지 않는 이메일입니다.");
    }
    if (!member.getMemPw().equals(password)) {
      throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
    }
    return member;
  }

  // BMI 계산
  private double calculateBMI(double height, double weight) {
    return weight / ((height / 100) * (height / 100));
  }

  // 기초대사량 계산
  private int calculateCalories(String gender, int age, double weight, double height) {
    if ("male".equals(gender)) {
      return (int) (66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age));
    } else {
      return (int) (655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age));
    }
  }

  // 영양소 기준 계산 및 MemberInfo에 설정
  private void calculateStandardNutrition(MemberInfo member, int calorie) {
    member.setCarbMin((int) Math.round(calorie * 0.55));
    member.setCarbMax((int) Math.round(calorie * 0.65));
    member.setProteinMin((int) Math.round(calorie * 0.15));
    member.setProteinMax((int) Math.round(calorie * 0.20));
    member.setFatMin((int) Math.round(calorie * 0.15));
    member.setFatMax((int) Math.round(calorie * 0.30));
  }

  // 이메일로 회원 조회
  public MemberInfo findByEmail(String email) {
    log.info("이메일로 회원 조회 시도: " + email);
    return memberDao.findByEmail(email);
  }

  // 아이디로 회원 조회
  public MemberInfo findById(String memId) {
    return memberDao.findById(memId);
  }
}
