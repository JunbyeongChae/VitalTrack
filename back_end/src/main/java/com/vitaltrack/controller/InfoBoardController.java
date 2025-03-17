package com.vitaltrack.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Map;
import com.vitaltrack.logic.InfoBoardLogic;
import com.vitaltrack.model.InfoBoard;

@RestController
@RequestMapping("/api/infoboard")
public class InfoBoardController {

    @Autowired
    private InfoBoardLogic infoBoardLogic;

    @PostMapping("/upload")
    public String uploadImage(@RequestParam MultipartFile file) {
        return infoBoardLogic.imageUpload(file);
    }

    @GetMapping("/list")
    public List<InfoBoard> getInfoBoardList(@RequestParam Map<String, Object> params) {
        return infoBoardLogic.getInfoBoardList(params);
    }

    @GetMapping("/{infoNo}")
    public InfoBoard getInfoBoardDetail(@PathVariable int infoNo) {
        return infoBoardLogic.getInfoBoardDetail(infoNo);
    }

    @PostMapping("/insert")
    public int insertInfoBoard(@RequestBody InfoBoard infoBoard) {
        return infoBoardLogic.insertInfoBoard(infoBoard);
    }

    @PutMapping("/update")
    public int updateInfoBoard(@RequestBody InfoBoard infoBoard) {
        return infoBoardLogic.updateInfoBoard(infoBoard);
    }

    @DeleteMapping("/delete")
    public int deleteInfoBoard(@RequestParam int infoNo) {
        return infoBoardLogic.deleteInfoBoard(infoNo);
    }
}
