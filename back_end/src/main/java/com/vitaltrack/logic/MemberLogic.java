package com.vitaltrack.logic;

import com.vitaltrack.dao.MemberDao;
import com.vitaltrack.model.MemberInfo;

import lombok.extern.log4j.Log4j2;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCrypt;

@Log4j2
@Service
public class MemberLogic {
  @Autowired
  private MemberDao memberDao;

  // 회원가입 처리
  @Transactional
  public int registerMember(MemberInfo member) {
    // 비밀번호 null 및 공백 체크
    if (member.getMemPw() == null || member.getMemPw().trim().isEmpty()) {
      throw new IllegalArgumentException("비밀번호가 입력되지 않았습니다.");
    }

    // 비밀번호 확인 검증
    if (member.getConfirmPassword() == null || !member.getMemPw().equals(member.getConfirmPassword())) {
      throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    }

    // 일상 활동량 필수 값 검증
    if (member.getActivityLevel() == null || member.getActivityLevel().isEmpty()) {
      throw new IllegalArgumentException("일상 활동량을 선택해 주세요.");
    }

    // 나이 필수 값 검증
    if (member.getMemAge() == null || member.getMemAge() <= 0) {
      throw new IllegalArgumentException("유효한 나이를 입력해 주세요.");
    }

    // 이메일 중복 검사
    if (memberDao.findByEmail(member.getMemEmail()) != null) {
      throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
    }

    // ID 중복 검사
    if (memberDao.existsById(member.getMemId()) > 0) {
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

    // 비밀번호 암호화
    String hashedPw = BCrypt.hashpw(member.getMemPw(), BCrypt.gensalt());
    member.setMemPw(hashedPw); // 암호화된 비밀번호 저장

    // 회원 정보 저장
    int result = memberDao.insertMember(member);

    // 체중 변화 기록 저장 (성공한 경우만)
    if (result > 0 && member.getMemNo() != null) {
      memberDao.insertOrUpdateWeightChange(member.getMemNo(), LocalDate.now().toString(), member.getMemWeight());
    }

    return result;
  }

  // 회원 정보 업데이트
  @Transactional
  public int updateUser(MemberInfo member) {
    // 기존 사용자 정보를 가져옴
    MemberInfo existingMember = memberDao.findByEmail(member.getMemEmail());

    // BMI 및 기초대사량 계산
    double bmi = calculateBMI(member.getMemHeight(), member.getMemWeight());
    int calorie = calculateCalories(member.getMemGen(), member.getMemAge(), member.getMemWeight(),
        member.getMemHeight());

    // 영양소 기준 설정
    calculateStandardNutrition(member, calorie);

    // 업데이트할 데이터 설정
    member.setMemBmi(bmi);
    member.setMemKcal(calorie);

    // 비밀번호가 수정된 경우에만 암호화하여 저장
    if (member.getMemPw() != null && !member.getMemPw().isBlank()) {
      String hashedPw = BCrypt.hashpw(member.getMemPw(), BCrypt.gensalt());
      member.setMemPw(hashedPw);
    } else {
      // 비밀번호가 전달되지 않았다면 기존 비밀번호 유지
      member.setMemPw(existingMember.getMemPw());
    }

    // 회원 정보 저장
    int result = memberDao.updateMember(member);

    // 체중이 변경된 경우에만 weightchange 테이블에 기록
    if (!existingMember.getMemWeight().equals(member.getMemWeight())) {
      memberDao.insertOrUpdateWeightChange(existingMember.getMemNo(), LocalDate.now().toString(),
          member.getMemWeight());
    }

    // 데이터베이스 업데이트
    return result;
  }

  // 로그인 검증
  public MemberInfo login(String memId, String password) {
    MemberInfo member = memberDao.findById(memId);
    log.info("로그인 시도: " + member);
    if (member == null) {
      throw new IllegalArgumentException("존재하지 않는 아이디입니다.");
    }

    String storedPw = member.getMemPw();
    boolean isPlainText = !storedPw.startsWith("$2a$");
    boolean match = isPlainText ? storedPw.equals(password) : BCrypt.checkpw(password, storedPw);

    if (!match) {
      throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
    }

    log.info("storedPw: " + storedPw);
    
    if (isPlainText) {
      String hashedPw = BCrypt.hashpw(password, BCrypt.gensalt());
      member.setMemPw(hashedPw);
      memberDao.updateMember(member);
      log.info("기존 평문 비밀번호를 Bcrypt로 암호화하여 저장 완료");
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
    if (email == null || email.isEmpty()) {
      throw new IllegalArgumentException("이메일이 null이거나 비어 있습니다.");
    }
    log.info("이메일로 회원 조회 시도: " + email);
    return memberDao.findByEmail(email);
  }

  // 아이디로 회원 조회
  public MemberInfo findById(String memId) {
    if (memId == null || memId.isEmpty()) {
      throw new IllegalArgumentException("아이디가 null이거나 비어 있습니다.");
    }
    log.info("아이디로 회원 조회 시도: " + memId);
    return memberDao.findById(memId);
  }

  // 회원 정보 삭제
  @Transactional
  public int deleteUser(String email) {
    MemberInfo member = memberDao.findByEmail(email);
    log.info("회원 정보 삭제 시도: " + member);
    if (member == null) {
      throw new IllegalArgumentException("존재하지 않는 회원입니다.");
    }

    // weightchange 데이터 삭제 (데이터가 없어도 문제없이 진행)
    int weightDeleted = memberDao.deleteWeightChangeByMemNo(member.getMemNo());
    log.info("WeightChange 삭제된 행 수: " + weightDeleted);

    // memberinfo 데이터 삭제
    int memberDeleted = memberDao.deleteByEmail(email);
    log.info("MemberInfo 삭제된 행 수: " + memberDeleted);

    if (memberDeleted == 0) {
      throw new IllegalArgumentException("회원 정보를 찾을 수 없습니다.");
    }

    return memberDeleted;
  }

  // 체중 변화 데이터 가져오기
  public List<Map<String, Object>> getWeightChanges(Integer memNo) {
    return memberDao.getWeightChanges(memNo);
  }
}
