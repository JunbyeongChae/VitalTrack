package com.vitaltrack.dao;

import com.vitaltrack.model.InfoBoard;
import com.vitaltrack.model.InfoBoardComment;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface InfoBoardDao {
  List<InfoBoard> getInfoBoardList(Map<String, Object> params);

  InfoBoard getInfoBoardDetail(int infoNo);

  int insertInfoBoard(InfoBoard infoBoard);

  int updateInfoBoard(InfoBoard infoBoard);

  int deleteInfoBoard(int infoNo);

  int incrementInfoBoardView(int infoNo);

  // 댓글 CRUD
  List<InfoBoardComment> getInfoBoardComments(int infoNo);

  // 댓글 등록
  int insertInfoBoardComment(InfoBoardComment comment);

  // 댓글 수정
  int updateInfoBoardComment(InfoBoardComment comment);

  int deleteInfoBoardComment(int commentId);
}
