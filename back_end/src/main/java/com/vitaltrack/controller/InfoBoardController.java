package com.vitaltrack.controller;

import com.vitaltrack.logic.InfoBoardLogic;
import com.vitaltrack.model.InfoBoard;
import com.vitaltrack.model.InfoBoardComment;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

@Log4j2
@RestController
@RequestMapping("/api/infoboard")
public class InfoBoardController {

  @Autowired
  private InfoBoardLogic infoBoardLogic;
  private String uploadDir = "src/main/webapp/image/infoboard";

  @GetMapping("/infoBoardList")
  public List<InfoBoard> getInfoBoardList(@RequestParam Map<String, Object> params) {
    return infoBoardLogic.getInfoBoardList(params);
  }

  @GetMapping("/infoBoardDetail")
  public ResponseEntity<InfoBoard> getInfoBoardDetail(@RequestParam("infoNo") Integer infoNo) {
    log.info("📌 API 요청 도착: /infoBoardDetail?infoNo=" + infoNo);
    if (infoNo == null) {
      log.error("요청 오류: infoNo가 누락됨");
      return ResponseEntity.badRequest().build(); // 🔹 400 Bad Request 반환
    }
    log.info("게시글 상세 조회 요청: infoNo=" + infoNo);
    try {
      InfoBoard board = infoBoardLogic.getInfoBoardDetail(infoNo);
      if (board == null) {
        return ResponseEntity.notFound().build(); // 🔹 404 Not Found 반환
      }
      return ResponseEntity.ok(board);
    } catch (Exception e) {
      log.error("게시글 상세 조회 중 오류 발생: ", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping("/infoBoardInsert")
  public int insertInfoBoard(@RequestBody InfoBoard infoBoard) {
    try {
      log.info("게시글 등록 요청: " + infoBoard);
      return infoBoardLogic.insertInfoBoard(infoBoard);
    } catch (Exception e) {
      log.error("게시글 등록 중 오류 발생: ", e);
      return 0; // 실패 시 0 반환
    }
  }

  @PutMapping("/infoBoardUpdate")
  public int updateInfoBoard(@RequestBody InfoBoard infoBoard) {
    try {
      log.info("게시글 수정 요청: " + infoBoard);
      return infoBoardLogic.updateInfoBoard(infoBoard);
    } catch (Exception e) {
      log.error("게시글 수정 중 오류 발생:", e);
      return 0; // 예외 발생 시 실패 처리
    }
  }

  @DeleteMapping("/infoBoardDelete")
  public int deleteInfoBoard(@RequestParam("infoNo") int infoNo) {
    return infoBoardLogic.deleteInfoBoard(infoNo);
  }

  // 댓글 목록 조회 API
  @GetMapping("/commentList")
  public ResponseEntity<List<InfoBoardComment>> getInfoBoardComments(@RequestParam(name = "infoNo") Integer infoNo) {
    if (infoNo == null) {
      return ResponseEntity.badRequest().body(null);
    }
    return ResponseEntity.ok(infoBoardLogic.getInfoBoardComments(infoNo));
  }

  // 댓글 등록 API
  @PostMapping("/commentInsert")
  public ResponseEntity<String> insertInfoBoardComment(@RequestBody InfoBoardComment comment) {
    if (comment.getMemNo() == 0 || comment.getCommentContent().trim().isEmpty()) {
      return ResponseEntity.badRequest().body("잘못된 요청 데이터입니다.");
    }
    int result = infoBoardLogic.insertInfoBoardComment(comment);
    return result > 0 ? ResponseEntity.ok("댓글이 등록되었습니다.") : ResponseEntity.internalServerError().body("댓글 등록 실패");
  }

  @PutMapping("/commentUpdate")
  public ResponseEntity<?> updateComment(@RequestBody InfoBoardComment comment) {
    try {
      int result = infoBoardLogic.updateInfoBoardComment(comment);
      return result > 0 ? ResponseEntity.ok("댓글이 수정되었습니다.") : ResponseEntity.badRequest().body("수정 실패");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
    }
  }

  @DeleteMapping("/commentDelete")
  public ResponseEntity<?> deleteComment(@RequestParam("commentId") int commentId) {
    log.info("댓글 삭제 요청: commentId=" + commentId);
    try {
      int result = infoBoardLogic.deleteInfoBoardComment(commentId);
      return result > 0 ? ResponseEntity.ok("댓글이 삭제되었습니다.") : ResponseEntity.badRequest().body("삭제 실패");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
    }
  }

  @PostMapping("/imageUpload")
  public String imageUpload(@RequestParam("image") MultipartFile image) {
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

  @GetMapping("/imageGet")
  public ResponseEntity<Resource> imageGet(@RequestParam(value = "imageName", required = true) String imageName) {
    log.info("imageGet 호출, 요청된 이미지: " + imageName);
    try {
      String decodedFileName = URLDecoder.decode(imageName, StandardCharsets.UTF_8);
      log.info("디코딩된 파일명: " + decodedFileName);

      File file = new File("src/main/webapp/image/infoboard/" + decodedFileName);
      if (!file.exists()) {
        log.warn("요청한 이미지가 존재하지 않습니다: " + decodedFileName);
        return ResponseEntity.notFound().build();
      }

      Resource resource = new UrlResource(file.toURI());
      return ResponseEntity.ok()
          .contentType(MediaType.parseMediaType("image/png")) // PNG 이미지 MIME 타입 지정
          .body(resource);
    } catch (Exception e) {
      log.error("imageGet Exception: " + e.toString());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
