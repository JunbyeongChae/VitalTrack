package com.vitaltrack.logic;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vitaltrack.dao.CounselBoardDao;
import com.vitaltrack.model.CounselBoard;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class CounselBoardLogic {
  @Autowired
  private CounselBoardDao counselBoardDao;// 절대로 new하지 않음.-빈관리를 받지않음.

  // application.yml에서 spring.file.upload-dir 키의 값을 주입받음
  @Value("${spring.file.upload-dir}")
  private String uploadDir;

  // 이미지 업로드
  public String imageUpload(MultipartFile image) {
    log.info("imageUpload 호출");
    String filename = null;
    if (image != null && !image.isEmpty()) {
      SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
      Calendar time = Calendar.getInstance();
      filename = sdf.format(time.getTime()) + "-" + image.getOriginalFilename().replaceAll(" ", "-");

      // [수정] application.yml에서 주입받은 경로 사용
      String fullPath = uploadDir + File.separator + filename;

      try {
        File file = new File(fullPath);
        if (!file.getParentFile().exists()) {
          boolean dirsCreated = file.getParentFile().mkdirs();
          if (!dirsCreated) {
            log.error("디렉토리 생성 실패: " + file.getParentFile().getAbsolutePath());
            return null;
          }
        }
        byte[] bytes = image.getBytes();
        try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file))) {
          bos.write(bytes);
          bos.flush();
        }
        log.info("파일 저장 성공: " + fullPath);

      } catch (Exception e) {
        log.error("imageUpload Exception: " + e.toString());
        filename = null;
      }
    } else {
      log.warn("업로드된 파일이 없습니다.");
    }
    return filename;
  }

  // 이미지 가져오기
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

  
  // 상담게시판 글 목록 조회하기
  public List<Map<String, Object>> boardList(Map<String, Object> pmap) {
    log.info("boardList 호출 성공.");
    List<Map<String, Object>> bList = null;
    try {
      bList = counselBoardDao.boardList(pmap);
    } catch (Exception e) {
      log.error("boardList 호출 중 오류 발생: ", e);
    }
    return bList;
  }

  // 상담게시판 글 등록하기
  public int boardInsert(CounselBoard board) {
    log.info("boardInsert 호출");
    int result = -1;
    result = counselBoardDao.boardInsert(board);
    return result;
  }

  // 상담게시판 글 상세 조회하기
  public List<Map<String, Object>> boardDetail(int counselNo) {
    log.info("boardDetail 호출, 파라미터: " + counselNo);
    List<Map<String, Object>> bList = counselBoardDao.boardDetail(counselNo);

    // 댓글 가져오기
    List<Map<String, Object>> commList = counselBoardDao.commentList(counselNo);

    // 댓글이 존재할 때만 추가
    if (commList != null && !commList.isEmpty()) {
      Map<String, Object> cmap = new HashMap<>();
      cmap.put("comments", commList);
      bList.add(1, cmap);
    }

    log.info("boardDetail 결과: " + bList);
    return bList;
  }

  // 상담게시판 글 수정하기
  public int boardUpdate(Map<String, Object> pmap) {
    int result = -1;
    result = counselBoardDao.boardUpdate(pmap);
    log.info("Update result:" + result);
    return result;
  }

  
  // 상담게시판 글 삭제하기
  public int boardDelete(int counselNo) {
    int result = -1;
    result = counselBoardDao.boardDelete(counselNo);
    log.info("Delete result:" + result);
    return result;
  }

  // 답변 등록하기
  public int commentInsert(Map<String, Object> pmap) {
    int result = -1;
    result = counselBoardDao.commentInsert(pmap);
    log.info("commentInsert result:" + result);
    return result;
  }

  // 답변 수정하기
  public int commentUpdate(Map<String, Object> pmap) {
    int result = -1;
    result = counselBoardDao.commentUpdate(pmap);
    log.info("commentUpdate result:" + result);
    return result;
  }

  // 답변 삭제하기
  public int commentDelete(int answerId) {
    int result = -1;
    result = counselBoardDao.commentDelete(answerId);
    log.info("commentDelete result:" + result);
    return result;
  }
}
