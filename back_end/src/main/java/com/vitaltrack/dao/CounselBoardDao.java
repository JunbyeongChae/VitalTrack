package com.vitaltrack.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.vitaltrack.model.CounselBoard;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Repository
public class CounselBoardDao {
  @Autowired
  private SqlSessionTemplate sessionTemplate;

  public List<Map<String, Object>> boardList(Map<String, Object> pmap) {
    log.info("boardList 호출");
    log.info("검색 조건: " + pmap.get("gubun") + ", " + pmap.get("keyword"));

    List<Map<String, Object>> bList = null;
    try {
      bList = sessionTemplate.selectList("com.mybatis.mapper.BoardMapper.boardList", pmap);
      if (bList == null) {
        log.warn("boardList 결과가 null입니다.");
        bList = new ArrayList<>(); // null 방지
      }
    } catch (Exception e) {
      log.error("boardList 실행 중 오류 발생: ", e);
    }
    return bList;
  }

  public int boardInsert(CounselBoard board) {
    log.info("boardInsert 호출");
    int result = -1;
    result = sessionTemplate.insert("com.mybatis.mapper.BoardMapper.boardInsert", board);
    return result;
  }

  // 원글에 대한 댓글을 조회하기
  public List<Map<String, Object>> commentList(Map<String, Object> pmap) {
    log.info("commentList 호출 성공");
    List<Map<String, Object>> commList = null;
    commList = sessionTemplate.selectList("com.mybatis.mapper.BoardMapper.commentList", pmap);
    log.info(commList);
    return commList;
  }

  public int boardDelete(int counselNo) {
    log.info("boardDelete 호출");
    int result = -1;
    result = sessionTemplate.delete("com.mybatis.mapper.BoardMapper.boardDelete", counselNo);
    return result;
  }

  public int boardUpdate(Map<String, Object> pmap) {
    log.info("boardUpdate 호출");
    int result = -1;
    result = sessionTemplate.update("com.mybatis.mapper.BoardMapper.boardUpdate", pmap);
    log.info("result : " + result);
    return result;
  }

  public int commentInsert(Map<String, Object> pmap) {
    log.info("commentInsert 호출");
    int result = -1;
    result = sessionTemplate.insert("com.mybatis.mapper.BoardMapper.commentInsert", pmap);
    log.info("commentInsert result:" + result);
    return result;
  }

  public int commentUpdate(Map<String, Object> pmap) {
    log.info("commentUpdate 호출");
    int result = -1;
    result = sessionTemplate.update("com.mybatis.mapper.BoardMapper.commentUpdate", pmap);
    log.info("commentUpdate result:" + result);
    return result;
  }

  public int commentDelete(int answerNo) {
    log.info("commentDelete 호출");
    int result = -1;
    result = sessionTemplate.delete("com.mybatis.mapper.BoardMapper.commentDelete", answerNo);
    log.info("commentDelete result:" + result);
    return result;
  }
}
