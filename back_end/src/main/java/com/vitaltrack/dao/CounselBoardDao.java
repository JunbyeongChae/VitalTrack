package com.vitaltrack.dao;

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
  private SqlSessionTemplate sessionTemplate = null;

  public List<Map<String, Object>> boardList(Map<String, Object> pmap) {
    log.info("boardList 호출");
    // gubun은 검색조건의 컬럼명 - b_title, b_content, mem_nickname
    log.info(pmap.get("gubun") + ", " + pmap.get("keyword"));
    List<Map<String, Object>> bList = null;
    bList = sessionTemplate.selectList("com.mybatis.mapper.BoardMapper.boardList", pmap);
    return bList;
  }

  public int boardInsert(CounselBoard board) {
    log.info("boardInsert 호출");
    int result = -1;
    result = sessionTemplate.insert("boardInsert", board);
    return result;
  }

  public void hitCount(Map<String, Object> pmap) {
    log.info("hitCount 호출");
    sessionTemplate.update("hitCount", pmap);
  }

  // 원글에 대한 댓글을 조회하기
  public List<Map<String, Object>> commentList(Map<String, Object> pmap) {
    log.info("commentList 호출 성공");
    List<Map<String, Object>> commList = null;
    commList = sessionTemplate.selectList("commentList", pmap);
    log.info(commList);
    return commList;
  }

  public int boardDelete(int b_no) {
    log.info("boardDelete 호출");
    int result = -1;
    result = sessionTemplate.delete("boardDelete", b_no);
    return result;
  }

  public int boardUpdate(Map<String,Object> pmap) {
    log.info("boardUpdate 호출");
    int result = -1;
    result = sessionTemplate.update("boardUpdate", pmap);
    log.info("result : " + result);
    return result;
  }

  public int commentInsert(Map<String,Object> pmap) {
    log.info("commentInsert 호출");
    int result = -1;
    result = sessionTemplate.insert("commentInsert", pmap);
    log.info("commentInsert result:" + result);
    return result;
  }

  public int commentUpdate(Map<String,Object> pmap) {
    log.info("commentUpdate 호출");
    int result = -1;
    result = sessionTemplate.update("commentUpdate", pmap);
    log.info("commentUpdate result:" + result);
    return result;
  }

  public int commentDelete(int bc_no) {
    log.info("commentDelete 호출");
    int result = -1;
    result = sessionTemplate.delete("commentDelete", bc_no);
    log.info("commentDelete result:" + result);
    return result;
  }
}
