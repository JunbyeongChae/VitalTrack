package com.vitaltrack.logic;

import com.vitaltrack.dao.MemberDao;
import com.vitaltrack.model.MemberInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberLogic {
  @Autowired
  private MemberDao memberDao;

  // 회원가입 처리
  public int registerMember(MemberInfo member) {
    // 비밀번호 null 체크 추가
    if (member.getMemPw() == null || member.getMemPw().isEmpty()) {
      throw new IllegalArgumentException("비밀번호가 입력되지 않았습니다.");
    }

    // 비밀번호 확인 검증 추가 (DB 저장 전 처리)
    if (member.getConfirmPassword() == null || !member.getMemPw().equals(member.getConfirmPassword())) {
      throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    }

    // 중복 검사
    if (memberDao.findByEmail(member.getMemEmail()) != null) {
      throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
    }
    if (memberDao.findById(member.getMemId()) != null) {
      throw new IllegalArgumentException("이미 존재하는 ID입니다.");
    }

    // BMI, 기초대사량 및 영양소 기준 계산
    double bmi = calculateBMI(member.getMemHeight(), member.getMemWeight());
    int calorie = calculateCalories(member.getMemGen(), member.getMemAge(), member.getMemWeight(),
        member.getMemHeight());
    String standNutri = calculateStandardNutrition(calorie);

    // 결과 저장
    member.setMemBmi(bmi);
    member.setMemKcal(calorie);
    member.setStandNutri(standNutri);

    return memberDao.insertMember(member); // confirmPassword는 MyBatis가 무시함
  }

  // 로그인 검증
  public MemberInfo login(String email, String password) {
    MemberInfo member = memberDao.findByEmail(email);
    if (member == null) {
        throw new IllegalArgumentException("존재하지 않는 이메일입니다.");
    }
    if (member.getMemPw() == null || !member.getMemPw().equals(password)) {
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
    if ("남성".equals(gender)) {
      return (int) (66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age));
    } else {
      return (int) (655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age));
    }
  }

  // 영양소 기준 계산
  private String calculateStandardNutrition(int calorie) {
    int carbMin = (int) (calorie * 0.55); // 탄수화물 최소 55%
    int carbMax = (int) (calorie * 0.65); // 탄수화물 최대 65%
    int proteinMin = (int) (calorie * 0.15); // 단백질 최소 15%
    int proteinMax = (int) (calorie * 0.2); // 단백질 최대 20%
    int fatMin = (int) (calorie * 0.15); // 지방 최소 15%
    int fatMax = (int) (calorie * 0.3); // 지방 최대 30%

    return String.format("탄수화물: %d-%dg, 단백질: %d-%dg, 지방: %d-%dg",
        carbMin, carbMax, proteinMin, proteinMax, fatMin, fatMax);
  }

  public MemberInfo findByEmail(String email) {
    return memberDao.findByEmail(email); // MyBatis에서 이메일 검색
  }
}
