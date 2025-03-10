package com.vitaltrack.controller;

import java.io.File;
import java.io.FileInputStream;
import java.util.List;
import java.util.Map;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
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
  private CounselBoardLogic counselboardLogic = null;// 선언만 한다. 그러면 ApplicationContext관리해줌.
  // 필요할 때 주입해준다.()

  //////////////// Quill Editor 사용하여 이미지 처리하기 구현 ///////////////
  // QuillEditor에서 이미지를 선택하면 <input type='file' name='image'
  // 누가 webapp/pds아래 파일을 만들어 주는거야
  @PostMapping("/imageUpload")
  public String imageUpload(@RequestParam(value = "image") MultipartFile image) {
    log.info("image : " + image);
    String filename = counselboardLogic.imageUpload(image);
    return filename;
  }

  @GetMapping("/imageGet")
  public String imageGet(HttpServletRequest req, HttpServletResponse res) {
    String imageName  = req.getParameter("imageName");
    log.info("imageGet 호출 성공===>" + imageName );
    String filePath = "src\\main\\webapp\\image";
    // String filePath ="upload"; // 절대경로.
    log.info("imageName : 8->euc" + imageName );
    File file = new File(filePath, imageName .trim());
    String mimeType = req.getServletContext().getMimeType(file.toString());
    // 브라우저는 모르는 mime type에 대해서는 다운로드 처리한다.
    // 보통 브라우저가 인지하는 ppt, xsl, word확장자 파일도 강제로 다운로드 처리 하고 싶을 때
    // application/octet-stream 를 마임타입으로 사용한다.
    if (mimeType == null) {
      // 강제로 이미지가 다운로드 되도록 처리 한다.
      res.setContentType("application/octet-stream");
    }
    String downName = null;
    FileInputStream fis = null;
    ServletOutputStream sos = null;
    try {
      if (req.getHeader("user-agent").indexOf("MSIE") == -1) {
        downName = new String(imageName .getBytes("UTF-8"), "8859_1");
      } else {
        downName = new String(imageName .getBytes("EUC-KR"), "8859_1");
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

  ////////////////////////////////////////////////////////////////////////

  /**************************************************************
   * 게시글 목록 조회 구현하기 - search|select|where|GET
   * URL패핑 이름 : counselboardList
   **************************************************************/
  @GetMapping("/counselList")
  public String counselboardList(@RequestParam Map<String, Object> pmap) {
    log.info("counselboardList호출 성공");
    List<Map<String, Object>> bList = null;
        try {
            bList = counselboardLogic.boardList(pmap);
            Gson g = new Gson();
            String temp = g.toJson(bList);
            return temp;
        } catch (Exception e) {
            log.error("counselList 호출 중 오류 발생: ", e);
            return "Error: " + e.getMessage();
        }
  }// end of counselboardList

  /**************************************************************
   * 게시글 상세 조회 구현하기 - search|select|where|GET
   * URL패핑 이름 : counselboardDetail
   **************************************************************/
  @GetMapping("counselboard/boardDetail")
  public String counselboardDetail(@RequestParam Map<String, Object> pmap) {
    log.info("counselboardDetail호출 성공");
    List<Map<String, Object>> bList = null;
    // 전체 조회와 다른 부분이 조회수 업데이트 처리하기 + 댓글이 있을 때 포함시키기
    bList = counselboardLogic.boardDetail(pmap);
    Gson g = new Gson();
    String temp = null;
    temp = g.toJson(bList);
    return temp;
  }// end of counselboardDetail

  /**************************************************************
   * 게시글 등록 구현하기 - param(@RequestParam)|insert|POST
   * URL패핑 이름 : counselboardInsert
   * 
   * @return 1이면 등록 성공, 0이면 등록 실패
   **************************************************************/
  @PostMapping("/counselboardInsert")
  public String counselboardInsert(@RequestBody CounselBoard counselboard) {
    log.info("counselboardInsert호출 성공");
    log.info(counselboard);
    int result = -1;// 초기값을 -1로 한 이유는 0과 1이 의미있는 숫자임.
    result = counselboardLogic.boardInsert(counselboard);
    return "" + result;// "-1"
  }

  /**************************************************************
   * 게시글 수정 구현하기 - param|update|where|pk|PUT
   * URL패핑 이름 : counselboardUpdate
   **************************************************************/
  @PutMapping("counselboard/counselboardUpdate")
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
  @DeleteMapping("counselboard/counselboardDelete")
  public String counselboardDelete(@RequestParam(value = "counselNo", required = true) int counselNo) {
    log.info("counselboardDelete호출 성공");
    int result = -1;// 초기값을 -1로 한 이유는 0과 1이 의미있는 숫자임.
    result = counselboardLogic.boardDelete(counselNo);
    return "" + result;// "-1"
  }

    /**************************************************************
   * 댓글 등록 구현하기 - insert|POST
   * URL패핑 이름 : commentInsert
   **************************************************************/
  @PostMapping("/commentInsert")
  public String commentInsert(@RequestBody Map<String, Object> pmap) {
    log.info("commentInsert호출 성공");
    int result = -1;// 초기값을 -1로 한 이유는 0과 1이 의미있는 숫자임.
    result = counselboardLogic.commentInsert(pmap);
    return "" + result;// "-1"
  }
  /****************************************************************
   * 댓글 수정 구현하기 - update|PUT
   * URL패핑 이름 : commentUpdate
   ***************************************************************/
  @PutMapping("counselboard/commentUpdate")
  public String commentUpdate(@RequestBody Map<String, Object> pmap) {
    log.info("commentUpdate호출 성공");
    int result = -1;// 초기값을 -1로 한 이유는 0과 1이 의미있는 숫자임.
    result = counselboardLogic.commentUpdate(pmap);
    return "" + result;// "-1"
  }
  /**************************************************************
   * 댓글 삭제 구현하기 - delete|DELETE
   * URL패핑 이름 : commentDelete
   **************************************************************/
  @DeleteMapping("counselboard/commentDelete")
  public String commentDelete(@RequestParam(value = "answerNo", required = true) int answerNo) {
    log.info("commentDelete 호출 성공");
    int result = -1;
    result = counselboardLogic.commentDelete(answerNo);
    log.info("result : " + result);
    return "" + result;
  }
}
