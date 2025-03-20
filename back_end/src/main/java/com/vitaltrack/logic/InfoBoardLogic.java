package com.vitaltrack.logic;

import com.vitaltrack.dao.InfoBoardDao;
import com.vitaltrack.model.InfoBoard;
import com.vitaltrack.model.InfoBoardComment;

import lombok.extern.log4j.Log4j2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.*;

@Log4j2
@Service
public class InfoBoardLogic {

  @Autowired
  private InfoBoardDao infoBoardDao;

  public List<InfoBoard> getInfoBoardList(Map<String, Object> params) {
    return infoBoardDao.getInfoBoardList(params);
  }

  public int insertInfoBoard(InfoBoard infoBoard) {
    return infoBoardDao.insertInfoBoard(infoBoard);
  }

  @Transactional
  public int updateInfoBoard(InfoBoard infoBoard) {
    if (infoBoard == null || infoBoard.getInfoNo() == null) {
      log.error("게시글 수정 실패: null 값 포함");
      return 0; // null 값 방지 처리 추가
    }
    log.info("게시글 수정 실행: " + infoBoard);
    return infoBoardDao.updateInfoBoard(infoBoard);
  }

  public int deleteInfoBoard(int infoNo) {
    return infoBoardDao.deleteInfoBoard(infoNo);
  }

  @Transactional
  public InfoBoard getInfoBoardDetail(int infoNo) {
    infoBoardDao.incrementInfoBoardView(infoNo);
    return infoBoardDao.getInfoBoardDetail(infoNo);
  }

  public String imageUpload(MultipartFile image, String type) {
    log.info("imageUpload 호출");
    String uploadDir = type.equals("infoboard") ? "src/main/webapp/image/infoboard" : "src/main/webapp/image/another";
    String filename = null;

    if (image != null && !image.isEmpty()) {
      SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
      filename = sdf.format(new Date()) + "-" + image.getOriginalFilename().replaceAll(" ", "-");
      String fullPath = uploadDir + File.separator + filename;

      try {
        File file = new File(fullPath);
        if (!file.getParentFile().exists()) {
          file.getParentFile().mkdirs();
        }
        image.transferTo(file);
        log.info("파일 저장 성공: " + fullPath);
      } catch (IOException e) {
        log.error("imageUpload Exception: " + e.toString());
        filename = null;
      }
    }
    return filename;
  }

  public byte[] imageGet(String imageName) {
    log.info("imageGet 호출");
    String fname = null;
    byte[] fileArray = null;
    try {
      fname = URLDecoder.decode(imageName, "UTF-8");
      log.info("fname:" + fname);
    } catch (Exception e) {
      log.info("imageGet Exception:" + e.toString());
      e.printStackTrace();
    }
    return fileArray;
  }

  // 댓글 목록 조회
  public List<InfoBoardComment> getInfoBoardComments(int infoNo) {
    List<InfoBoardComment> comments = infoBoardDao.getInfoBoardComments(infoNo);
    return comments;
  }

  // 댓글 등록
  public int insertInfoBoardComment(InfoBoardComment comment) {
    if (comment.getMemNo() == 0 || comment.getCommentContent().trim().isEmpty()) {
      log.error("❌ 댓글 등록 실패: 잘못된 요청 데이터");
      return 0;
    }
    return infoBoardDao.insertInfoBoardComment(comment);
  }

  public int updateInfoBoardComment(InfoBoardComment comment) {
    return infoBoardDao.updateInfoBoardComment(comment);
  }

  public int deleteInfoBoardComment(int commentId) {
    return infoBoardDao.deleteInfoBoardComment(commentId);
  }
}
