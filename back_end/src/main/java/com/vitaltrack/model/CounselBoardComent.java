package com.vitaltrack.model;

import lombok.Data;

@Data
public class CounselBoardComent {
    private int answerId;           // 댓글 ID
    private String answerWriter;    // 작성자
    private String answerContent;   // 내용
    private int counselNo;          // 상담글 번호 (외래키)
    private int memNo;              // 회원 번호 (외래키) - 추가
}