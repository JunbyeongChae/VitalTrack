package com.vitaltrack.logic;

import com.vitaltrack.dao.InfoBoardDao;
import com.vitaltrack.model.InfoBoard;
import com.vitaltrack.model.InfoBoardComment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class InfoBoardLogic {

    @Autowired
    private InfoBoardDao infoBoardDao;

    public List<InfoBoard> getInfoBoardList(Map<String, Object> params) {
        return infoBoardDao.getInfoBoardList(params);
    }

    public InfoBoard getInfoBoardDetail(int infoNo) {
        infoBoardDao.incrementInfoBoardView(infoNo);
        return infoBoardDao.getInfoBoardDetail(infoNo);
    }

    public int insertInfoBoard(InfoBoard infoBoard) {
        return infoBoardDao.insertInfoBoard(infoBoard);
    }

    public int updateInfoBoard(InfoBoard infoBoard) {
        return infoBoardDao.updateInfoBoard(infoBoard);
    }

    public int deleteInfoBoard(int infoNo) {
        return infoBoardDao.deleteInfoBoard(infoNo);
    }

    public String imageUpload(MultipartFile image) {
        String filename = null;
        try {
            if (image != null && !image.isEmpty()) {
                String originalFilename = image.getOriginalFilename().replaceAll(" ", "_");
                String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
                filename = timestamp + "_" + originalFilename;

                File uploadDir = new File("src/main/webapp/image");
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                File file = new File(uploadDir, filename);
                image.transferTo(file);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return filename;
    }

    public List<InfoBoardComment> getInfoBoardComments(int infoNo) {
        return infoBoardDao.getInfoBoardComments(infoNo);
    }

    public int insertInfoBoardComment(InfoBoardComment comment) {
        return infoBoardDao.insertInfoBoardComment(comment);
    }

    public int updateInfoBoardComment(InfoBoardComment comment) {
        return infoBoardDao.updateInfoBoardComment(comment);
    }

    public int deleteInfoBoardComment(int commentId) {
        return infoBoardDao.deleteInfoBoardComment(commentId);
    }
}
