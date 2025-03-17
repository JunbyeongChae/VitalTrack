package com.vitaltrack.model;

import lombok.Data;
import java.time.LocalDate;

@Data
public class InfoBoard {
  private Long infoNo;
  private String infoTitle;
  private String infoContent;
  private String infoCategory;
  private LocalDate infoDate;
  private String infoFile;
  private Integer memNo;
  private Integer infoView;
  private Integer infoLike;
}
