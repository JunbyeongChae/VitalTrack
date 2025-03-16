package com.vitaltrack.controller;

import com.vitaltrack.logic.InfoBoardLogic;
import com.vitaltrack.model.InfoBoard;
import com.vitaltrack.model.InfoBoardComment;

import lombok.extern.log4j.Log4j2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
@RestController
@RequestMapping("/api/infoboard")
public class InfoBoardController {

  @Autowired
  private InfoBoardLogic infoBoardLogic;

  // 게시판 목록 조회
  @GetMapping("/infoBoardList")
  public List<InfoBoard> getInfoBoardList(@RequestParam(required = false) String gubun,
      @RequestParam(required = false) String keyword) {
    Map<String, Object> params = new HashMap<>();
    params.put("gubun", gubun);
    params.put("keyword", keyword);
    return infoBoardLogic.getInfoBoardList(params);
  }

  // 게시판 상세 조회
  @GetMapping("/infoBoardDetail")
  public InfoBoard getInfoBoardDetail(@RequestParam int infoNo) {
    return infoBoardLogic.getInfoBoardDetail(infoNo);
  }

  // 게시판 등록
  @PostMapping("/infoBoardInsert")
  public int insertInfoBoard(@RequestBody InfoBoard infoBoard) {
    return infoBoardLogic.insertInfoBoard(infoBoard);
  }

  // 게시판 수정
  @PutMapping("/infoBoardUpdate")
  public int updateInfoBoard(@RequestBody InfoBoard infoBoard) {
    return infoBoardLogic.updateInfoBoard(infoBoard);
  }

  // 게시판 삭제
  @DeleteMapping("/infoBoardDelete")
  public int deleteInfoBoard(@RequestParam int infoNo) {
    return infoBoardLogic.deleteInfoBoard(infoNo);
  }

  // 댓글 목록 조회
  @GetMapping("/comments")
  public List<InfoBoardComment> getInfoBoardComments(@RequestParam int infoNo) {
    return infoBoardLogic.getInfoBoardComments(infoNo);
  }

  // 댓글 등록
  @PostMapping("/comment")
  public int insertInfoBoardComment(@RequestBody InfoBoardComment comment) {
    return infoBoardLogic.insertInfoBoardComment(comment);
  }

  // 댓글 수정
  @PutMapping("/comment")
  public int updateInfoBoardComment(@RequestBody InfoBoardComment comment) {
    return infoBoardLogic.updateInfoBoardComment(comment);
  }

  // 댓글 삭제
  @DeleteMapping("/comment")
  public int deleteInfoBoardComment(@RequestParam int commentId) {
    return infoBoardLogic.deleteInfoBoardComment(commentId);
  }
}
