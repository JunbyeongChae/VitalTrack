package com.vitaltrack.model;

import lombok.Data;

@Data
public class CounselBoardComent {
  private int bc_no = 0; //댓글번호
  private String nickname = null; //닉네임
  private String bc_comment = null;//댓글내용
  private String bc_date = null;//작성일
  private int b_no = 0;//원글번호
}
