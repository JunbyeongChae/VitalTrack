package com.vitaltrack.logic;

import com.vitaltrack.dao.InfoBoardDao;
import com.vitaltrack.model.InfoBoard;
import com.vitaltrack.model.InfoBoardComment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class InfoBoardLogic {
  @Autowired
  private InfoBoardDao infoBoardDao;

  // 게시글 목록 조회
  public List<InfoBoard> getInfoBoardList(Map<String, Object> params) {
    return infoBoardDao.getInfoBoardList(params);
  }
  
  // 게시글 상세 조회
  public InfoBoard getInfoBoardDetail(int infoNo) {
    return infoBoardDao.getInfoBoardDetail(infoNo);
  }

  // 게시글 등록
  public int insertInfoBoard(InfoBoard infoBoard) {
    return infoBoardDao.insertInfoBoard(infoBoard);
  }

  // 게시글 수정
  public int updateInfoBoard(InfoBoard infoBoard) {
    return infoBoardDao.updateInfoBoard(infoBoard);
  }

  // 게시글 삭제
  public int deleteInfoBoard(int infoNo) {
    return infoBoardDao.deleteInfoBoard(infoNo);
  }

  // 댓글 목록 조회
  public List<InfoBoardComment> getInfoBoardComments(int infoNo) {
    return infoBoardDao.getInfoBoardComments(infoNo);
  }

  // 댓글 등록
  public int insertInfoBoardComment(InfoBoardComment comment) {
    return infoBoardDao.insertInfoBoardComment(comment);
  }

  // 댓글 수정
  public int updateInfoBoardComment(InfoBoardComment comment) {
    return infoBoardDao.updateInfoBoardComment(comment);
  }

  // 댓글 삭제
  public int deleteInfoBoardComment(int commentId) {
    return infoBoardDao.deleteInfoBoardComment(commentId);
  }
}
