package com.vitaltrack.dao;

import com.vitaltrack.model.InfoBoard;
import com.vitaltrack.model.InfoBoardComment;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface InfoBoardDao {
  // 게시글 목록 조회
  List<InfoBoard> getInfoBoardList(Map<String, Object> params);

  // 게시글 상세 조회
  InfoBoard getInfoBoardDetail(int infoNo);

  // 게시글 등록
  int insertInfoBoard(InfoBoard infoBoard);
  
  // 게시글 수정
  int updateInfoBoard(InfoBoard infoBoard);

  // 게시글 삭제
  int deleteInfoBoard(int infoNo);

  // 댓글 목록 조회
    List<InfoBoardComment> getInfoBoardComments(int infoNo);

    // 댓글 등록
    int insertInfoBoardComment(InfoBoardComment comment);

    // 댓글 수정
    int updateInfoBoardComment(InfoBoardComment comment);

    // 댓글 삭제
    int deleteInfoBoardComment(int commentId);
}
