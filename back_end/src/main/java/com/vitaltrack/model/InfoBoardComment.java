package com.vitaltrack.model;

import java.time.LocalDate;

import lombok.Data;

@Data
public class InfoBoardComment {
  private int commentId;
  private String commentContent;
  private LocalDate commentDate;
  private int memNo;
  private long infoNo;
}
