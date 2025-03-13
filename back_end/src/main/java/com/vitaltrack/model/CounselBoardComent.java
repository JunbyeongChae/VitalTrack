package com.vitaltrack.model;

import lombok.Data;

@Data
public class CounselBoardComent {
  private int answerNo = 0; // 댓글번호
  private String memNick = null; // 닉네임
  private String answerComment = null; // 댓글내용
  private String answerDate = null; // 작성일
  private int counselNo = 0; // 원글번호
}
