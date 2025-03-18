import axios from 'axios';


// 게시판 목록 조회 (필터링 포함)
export const infoBoardListDB = ({ gubun, keyword }) => {
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'get',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/infoBoardList`,
        params: { gubun, keyword },
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 게시판 상세 조회
export const infoBoardDetailDB = (infoNo) => {
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'get',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/infoBoardDetail?infoNo=${infoNo}`,
        params: { infoNo },
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 게시판 등록
export const infoBoardInsertDB = (board) => {
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'post',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/infoBoardInsert`,
        data: board,
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 게시판 수정
export const infoBoardUpdateDB = (board) => {
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'put',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/infoBoardUpdate`,
        data: board,
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 게시판 삭제
export const infoBoardDeleteDB = (infoNo) => {
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'delete',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/infoBoardDelete`,
        params: { infoNo },
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 이미지 업로드 API
export const uploadImageDB = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const response = axios({
        method: 'post',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/imageUpload`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        processData: false,
        contentType: false,
        data: file,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

// 댓글 목록 조회
export const infoCommentListDB = (infoNo) => {
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'get',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/comments`,
        params: { infoNo },
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 댓글 등록
export const infoCommentInsertDB = (comment) => {
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'post',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/comment`,
        data: comment,
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 댓글 수정
export const infoCommentUpdateDB = (comment) => {
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'put',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/comment`,
        data: comment,
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 댓글 삭제
export const infoCommentDeleteDB = (commentId) => {
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'delete',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/comment`,
        params: { commentId },
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};
