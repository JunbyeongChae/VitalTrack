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
  private String memNick;

  public InfoBoard() {
      this.infoCategory = this.infoCategory != null ? this.infoCategory : "기타";
      this.infoView = this.infoView != null ? this.infoView : 0;
      this.infoLike = this.infoLike != null ? this.infoLike : 0;
  }
}
