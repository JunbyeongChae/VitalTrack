package com.vitaltrack.model;

import lombok.Data;

@Data
public class CounselBoardComent {
  private int answer_no = 0; //댓글번호
  private String mem_nick = null; //닉네임
  private String answer_comment = null;//댓글내용
  private String answer_date = null;//작성일
  private int counsel_no = 0;//원글번호
}
