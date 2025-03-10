package com.vitaltrack.model;

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
  private Integer memAge;
  private Integer carbMin;
  private Integer carbMax;
  private Integer proteinMin;
  private Integer proteinMax;
  private Integer fatMin;
  private Integer fatMax;
  private String activityLevel;

  private transient String confirmPassword; // DB 저장 제외 필드 추가
}