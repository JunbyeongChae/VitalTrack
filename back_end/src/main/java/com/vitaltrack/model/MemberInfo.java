package com.vitaltrack.model;

import javax.persistence.Transient;

import lombok.Data;

@Data
public class MemberInfo {
  private Integer memNo;
  private String memId;
  private String memPw;

  @Transient
  private String confirmPassword;

  private String memNick;
  private String memPhone;
  private String memEmail;
  private Double memHeight;
  private Double memWeight;
  private Double memBmi;
  private Integer memKcal;
  private String memGen;
  private Integer memAge;
  private String standNutri;
  private String activityLevel; // ENUM 값 그대로 사용
}