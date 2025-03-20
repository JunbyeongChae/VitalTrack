package com.vitaltrack.controller;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.vitaltrack.logic.CounselBoardLogic;
import com.vitaltrack.model.CounselBoard;

import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/api/counsel")
public class CounselBoardController {
  @Autowired
  private CounselBoardLogic counselboardLogic = null;

  /**************************************************************
   * 게시글 목록 조회 구현하기 - search|select|where|GET
   * URL패핑 이름 : counselboardList
   **************************************************************/
  @GetMapping("/counselList")
  public String counselboardList(@RequestParam Map<String, Object> pmap) {
    log.info("counselboardList 호출");

    // admin 값이 문자열로 전달될 경우, 정수 변환
    if (pmap.containsKey("admin")) {
      pmap.put("admin", Integer.parseInt(pmap.get("admin").toString()));
    }

    List<Map<String, Object>> bList = counselboardLogic.boardList(pmap);
    if (bList == null) {
      bList = new ArrayList<>();
    }

    Gson gson = new Gson();
    return gson.toJson(bList);
  }

  /**************************************************************
   * 게시글 상세 조회 구현하기 - search|select|where|GET
   * URL패핑 이름 : counselboardDetail
   **************************************************************/
  @GetMapping("/counselboardDetail")
  public String counselboardDetail(@RequestParam("counselNo") int counselNo) {
    log.info("counselboardDetail 호출, counselNo: " + counselNo);
    List<Map<String, Object>> boardDetail = counselboardLogic.boardDetail(counselNo);

    // 댓글 데이터 가져오기
    List<Map<String, Object>> comments = counselboardLogic.commentList(counselNo);

    if (!boardDetail.isEmpty()) {
      boardDetail.get(0).put("comments", comments); //게시글 데이터에 댓글 추가
    }

    Gson gson = new Gson();
    return gson.toJson(boardDetail);
  } // end of counselboardDetail

  /**************************************************************
   * 게시글 등록 구현하기 - param(@RequestParam)|insert|POST
   * URL패핑 이름 : counselboardInsert
   * 
   * @return 1이면 등록 성공, 0이면 등록 실패
   **************************************************************/
  @PostMapping("/counselboardInsert")
  public String counselboardInsert(@RequestBody CounselBoard counselboard) {
    log.info("counselboardInsert 호출 성공");
    int result = counselboardLogic.boardInsert(counselboard);
    return String.valueOf(result);
  }

  /**************************************************************
   * 게시글 수정 구현하기 - param|update|where|pk|PUT
   * URL패핑 이름 : counselboardUpdate
   **************************************************************/
  @PutMapping("/counselboardUpdate")
  public String counselboardUpdate(@RequestBody Map<String, Object> pmap) {
    log.info("counselboardUpdate호출 성공");
    int result = -1;// 초기값을 -1로 한 이유는 0과 1이 의미있는 숫자임.
    result = counselboardLogic.boardUpdate(pmap);
    log.info("result : " + result);
    return "" + result;
  }

  /**************************************************************
   * 게시글 삭제 구현하기 - pk|delete|where|DELETE
   * URL패핑 이름 : counselboardDelete
   **************************************************************/
  @DeleteMapping("/counselboardDelete")
  public String counselboardDelete(@RequestParam(value = "counselNo", required = true) int counselNo) {
    log.info("counselboardDelete호출 성공");
    int result = -1;// 초기값을 -1로 한 이유는 0과 1이 의미있는 숫자임.
    result = counselboardLogic.boardDelete(counselNo);
    return String.valueOf(result);// "-1"
  }

  /**************************************************************
   * 댓글 등록 구현하기 - insert|POST
   * URL패핑 이름 : commentInsert
   **************************************************************/
  @PostMapping("/commentInsert")
  public String commentInsert(@RequestBody Map<String, Object> pmap) {
    log.info("commentInsert 호출 성공");
    int result = counselboardLogic.commentInsert(pmap);
    return "" + result;
  }

  /****************************************************************
   * 댓글 수정 구현하기 - update|PUT
   * URL패핑 이름 : commentUpdate
   ***************************************************************/
  @PutMapping("/commentUpdate")
  public ResponseEntity<?> commentUpdate(@RequestBody Map<String, Object> pmap) {
    log.info("commentUpdate 호출 성공, 데이터: " + pmap);

    // 요청에서 answerId와 memNo를 가져옴
    if (!pmap.containsKey("answerId") || !pmap.containsKey("memNo")) {
      log.warn("필수 데이터 누락: " + pmap);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청입니다.");
    }

    int answerId = Integer.parseInt(pmap.get("answerId").toString());
    int requestMemNo = Integer.parseInt(pmap.get("memNo").toString());

    // 기존 댓글 작성자의 memNo 조회
    Integer originalMemNo = counselboardLogic.getCommentWriterMemNo(answerId);

    // 작성자 조회 실패 처리
    if (originalMemNo == null) {
      log.error("댓글 작성자 확인 실패: answerId=" + answerId);
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("댓글을 찾을 수 없습니다.");
    }

    // 작성자 불일치 시 수정 불가
    if (!originalMemNo.equals(requestMemNo)) {
      log.warn("수정 권한 없음: 요청자 [" + requestMemNo + "] != 작성자 [" + originalMemNo + "]");
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body("댓글 수정 권한이 없습니다.");
    }

    // 수정 로직 실행
    int result = counselboardLogic.commentUpdate(pmap);
    if (result > 0) {
      return ResponseEntity.ok("댓글이 수정되었습니다.");
    } else {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 수정 실패");
    }
  }

  /**************************************************************
   * 댓글 삭제 구현하기 - delete|DELETE
   * URL패핑 이름 : commentDelete
   **************************************************************/
  @DeleteMapping("/commentDelete")
  public String commentDelete(@RequestParam(value = "answerId", required = true) int answerId) {
    log.info("commentDelete 호출 성공");
    int result = -1;
    result = counselboardLogic.commentDelete(answerId);
    log.info("result : " + result);
    return "" + result;
  }

  /**************************************************************
   * 댓글 목록 조회 구현하기 - insert|GET
   * URL패핑 이름 : commentList
   **************************************************************/
  @GetMapping("/commentList")
  public List<Map<String, Object>> commentList(@RequestParam("counselNo") int counselNo) {
    log.info("commentList 호출 성공");
    return counselboardLogic.commentList(counselNo);
  }

  @PostMapping("/imageUpload")
  public String imageUpload(@RequestParam(value = "image") MultipartFile image) {
    log.info("image : " + image);
    String filename = counselboardLogic.imageUpload(image);
    return filename;
  }

  @GetMapping("/imageGet")
  public String imageGet(HttpServletRequest req, HttpServletResponse res) {
    String imageName = req.getParameter("imageName");
    log.info("imageGet 호출 성공===>" + imageName);
    String filePath = "src\\main\\webapp\\image\\counsel";
    log.info("imageName : 8->euc" + imageName);
    File file = new File(filePath, imageName.trim());
    String mimeType = req.getServletContext().getMimeType(file.toString());
    if (mimeType == null) {
      res.setContentType("application/octet-stream");
    }
    String downName = null;
    FileInputStream fis = null;
    ServletOutputStream sos = null;
    try {
      if (req.getHeader("user-agent").indexOf("MSIE") == -1) {
        downName = new String(imageName.getBytes("UTF-8"), "8859_1");
      } else {
        downName = new String(imageName.getBytes("EUC-KR"), "8859_1");
      }
      res.setHeader("Content-Disposition", "attachment;filename=" + downName);
      fis = new FileInputStream(file);
      sos = res.getOutputStream();
      byte b[] = new byte[1024 * 10];
      int data = 0;
      while ((data = (fis.read(b, 0, b.length))) != -1) {
        sos.write(b, 0, data);
      }
      sos.flush();
    } catch (Exception e) {
      log.info(e.toString());
    } finally {
      try {
        if (sos != null)
          sos.close();
        if (fis != null)
          fis.close();
      } catch (Exception e2) {
        log.info(e2.toString());
      }
    }
    return null;
  }// end of imageGet
}
