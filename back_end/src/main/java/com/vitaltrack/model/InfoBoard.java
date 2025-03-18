package com.vitaltrack.model;

import java.sql.Date;

import org.springframework.lang.Nullable;

public class InfoBoard {
    private int infoNo;          // 글번호
    private String infoTitle;    // 글제목
    private String infoContent;  // 글내용
    private Date infoDate;       // 작성일

    // infoFile은 NULL 허용 컬럼으로, 사용 여부에 따라 값이 없을 수 있음.
    @Nullable
    private String infoFile;     // 첨부파일 (NULL 허용)

    private int memNo;              // 회원번호 (외래키)
}
