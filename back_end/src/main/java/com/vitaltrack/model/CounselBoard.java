package com.vitaltrack.model;

import lombok.Data;

@Data
public class CounselBoard {
  private int b_no = 0;//글번호
  private String b_title = "";//글제목
  private String nickname = null;//닉네임
  private String b_content = null;//글내용
  private int b_hit = 0;//조회수
  private String b_date = null;//작성일
  private String b_file = null;//첨부파일
}
