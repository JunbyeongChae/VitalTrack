package com.vitaltrack.model;

import java.sql.Date;

import org.springframework.lang.Nullable;

import lombok.Data;

@Data
public class CounselBoard {
    private int counselNo;          // 글번호
    private String counselTitle;    // 글제목
    private String counselContent;  // 글내용
    private Date counselDate;       // 작성일

    // counselFile은 NULL 허용 컬럼으로, 사용 여부에 따라 값이 없을 수 있음.
    @Nullable
    private String counselFile;     // 첨부파일 (NULL 허용)

    private int memNo;              // 회원번호 (외래키)
}