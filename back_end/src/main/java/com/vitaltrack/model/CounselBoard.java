package com.vitaltrack.model;

import java.sql.Date;

import lombok.Data;

@Data
public class CounselBoard {
  private int counselNo;          // 글번호
  private String counselTitle;    // 글제목
  private String counselContent;  // 글내용
  private Date counselDate;       // 작성일
  private String counselFile;     // 첨부파일
  private int memNo;              // 회원번호 (외래키)
}