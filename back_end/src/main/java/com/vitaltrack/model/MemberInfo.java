package com.vitaltrack.model;

import javax.persistence.Transient;

import lombok.Data;

@Data
public class MemberInfo {
  private Integer memNo;
  private String memId;
  private String memPw;
  private String memNick;
  private String memPhone;
  private String memEmail;
  private Double memHeight;
  private Double memWeight;
  private Double memBmi;
  private Integer memKcal;
  private String memGen;
  private Integer memAge = 0;
  private Integer carbMin;
  private Integer carbMax;
  private Integer proteinMin;
  private Integer proteinMax;
  private Integer fatMin;
  private Integer fatMax;
  private String activityLevel;
  private int admin; //기본값 0으로 초기화

  @Transient
  private String confirmPassword; // DB 저장 제외 필드 추가

  private String birthYear;
  private String birthMonth;
  private String birthDay;
}