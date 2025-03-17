package com.vitaltrack.model;

import java.time.LocalDate;

public class InfoBoardComment {
    private int commentId;           // 댓글 ID
    private String commentContent;   // 내용

    // commentDate는 LocalDate로 타입 변경 (DB와 일치)
    private LocalDate commentDate;

    private int infoNo;          // 상담글 번호 (외래키)
    private int memNo;              // 회원 번호 (외래키) - 추가
}
