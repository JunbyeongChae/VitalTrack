package com.vitaltrack.model;

import java.sql.Date;

import lombok.Data;

@Data
public class CounselBoard {
  private int counselNo = 0; // 글번호
  private String counselTitle = ""; // 글제목
  private String memNick = null; // 닉네임
  private String counselContent = null; // 글내용
  private Date counselDate = null; // 작성일
  private String counselFile = null; // 첨부파일
}