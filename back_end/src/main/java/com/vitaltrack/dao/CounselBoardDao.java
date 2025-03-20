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

  // 상담게시판 글 목록 조회하기
  public List<Map<String, Object>> boardList(Map<String, Object> pmap) {
    log.info("boardList 호출");
    log.info("검색 조건: " + pmap.get("gubun") + ", " + pmap.get("keyword"));

    List<Map<String, Object>> bList = null;
    try {
      bList = sessionTemplate.selectList("com.vitaltrack.dao.CounselBoardDao.boardList", pmap);
      if (bList == null) {
        log.warn("boardList 결과가 null입니다.");
        bList = new ArrayList<>(); // null 방지
      }
    } catch (Exception e) {
      log.error("boardList 실행 중 오류 발생: ", e);
    }
    return bList;
  }

  // 상담게시판 글 상세 조회하기
  public List<Map<String, Object>> boardDetail(int counselNo) {
    log.info("boardDetail 호출");
    List<Map<String, Object>> bDetail = new ArrayList<>(); // null 방지
    try {
      bDetail = sessionTemplate.selectList("com.vitaltrack.dao.CounselBoardDao.boardDetail", counselNo);
      log.info("boardDetail 결과: " + bDetail);
    } catch (Exception e) {
      log.error("boardDetail 실행 중 오류 발생: ", e);
    }
    return bDetail;
  }

  // 상담게시판 글 등록하기
  public int boardInsert(CounselBoard board) {
    log.info("boardInsert 호출");
    int result = -1;
    result = sessionTemplate.insert("com.vitaltrack.dao.CounselBoardDao.boardInsert", board);
    return result;
  }

  public int boardDelete(int counselNo) {
    log.info("boardDelete 호출");
    int result = -1;
    result = sessionTemplate.delete("com.vitaltrack.dao.CounselBoardDao.boardDelete", counselNo);
    return result;
  }

  public int boardUpdate(Map<String, Object> pmap) {
    log.info("boardUpdate 호출");
    int result = -1;
    result = sessionTemplate.update("com.vitaltrack.dao.CounselBoardDao.boardUpdate", pmap);
    log.info("result : " + result);
    return result;
  }

  // 댓글 작성자 조회 (작성자 검증용)
  public Integer getCommentWriterMemNo(int answerId) {
    log.info("getCommentWriterMemNo 호출, answerId: " + answerId);

    Integer writerMemNo = null;
    try {
      writerMemNo = sessionTemplate.selectOne("com.vitaltrack.dao.CounselBoardDao.getCommentWriterMemNo", answerId);
      if (writerMemNo == null) {
        log.warn("해당 댓글의 작성자를 찾을 수 없음, answerId=" + answerId);
      }
    } catch (Exception e) {
      log.error("getCommentWriterMemNo 실행 중 오류 발생: ", e);
    }

    return writerMemNo;
  }

  // 답변 조회하기
  public List<Map<String, Object>> commentList(int counselNo) {
    log.info("commentList 호출 성공, 파라미터: " + counselNo);
    List<Map<String, Object>> commList = new ArrayList<>();
    try {
      commList = sessionTemplate.selectList("com.vitaltrack.dao.CounselBoardDao.commentList", counselNo);
      log.info("commentList 결과: " + commList);
    } catch (Exception e) {
      log.error("commentList 실행 중 오류 발생:", e);
    }
    return commList;
  }

  // 답변 등록하기
  public int commentInsert(Map<String, Object> pmap) {
    log.info("commentInsert 호출");
    int result = sessionTemplate.insert("com.vitaltrack.dao.CounselBoardDao.commentInsert", pmap);
    log.info("commentInsert result:" + result);
    return result;
  }

  // 답변 수정하기
  public int commentUpdate(Map<String, Object> pmap) {
    log.info("commentUpdate 호출");
    int result = sessionTemplate.update("com.vitaltrack.dao.CounselBoardDao.commentUpdate", pmap);
    log.info("commentUpdate result:" + result);
    return result;
  }

  // 답변 삭제하기
  public int commentDelete(int answerNo) {
    log.info("commentDelete 호출");
    int result = -1;
    result = sessionTemplate.delete("com.vitaltrack.dao.CounselBoardDao.commentDelete", answerNo);
    log.info("commentDelete result:" + result);
    return result;
  }
}
