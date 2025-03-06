package com.vitaltrack.model;

import java.sql.Date;

import lombok.Data;

@Data
public class CounselBoard {
  private int counsel_no = 0;//글번호
  private String counsel_title = "";//글제목
  private String mem_nick = null;//닉네임
  private String counsel_content = null;//글내용
  private Date counsel_date = null;//작성일
  private String counsel_file = null;//첨부파일
}