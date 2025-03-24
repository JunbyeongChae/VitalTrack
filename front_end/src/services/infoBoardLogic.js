import axios from 'axios';

// 게시판 목록 조회 (필터링 포함)
export const infoBoardListDB = ({ keyword, category }) => {
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'get',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/infoBoardList`,
        params: { gubun: 'infoContent', keyword, category }
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 게시판 상세 조회
export const infoBoardDetailDB = (infoNo) => {
  return new Promise(async (resolve, reject) => { // ✅ async 추가
    try {
      const res = await axios({ // ✅ await 추가
        method: 'get',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/infoBoardDetail?infoNo=${infoNo}`
      });
      resolve(res); // 이제 실제 응답 데이터가 반환됨
    } catch (error) {
      reject(error);
    }
  });
};

// 게시판 등록 (infoCategory 포함)
export const infoBoardInsertDB = (board) => {
  console.log('infoBoardInsertDB called with:', board); // 디버깅용 로그
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'post',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/infoBoardInsert`,
        data: {
          infoTitle: board.infoTitle,
          infoContent: board.infoContent,
          infoCategory: board.infoCategory, // infoCategory 추가
          infoDate: board.infoDate,
          memNo: board.memNo,
          infoFile: board.infoFile || null // 파일이 없을 경우 null로 처리
        }
      });
      console.log(res.url)
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
        data: board
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
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/infoBoardDelete?infoNo=${infoNo}`,
        params: { infoNo }
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 이미지 업로드 api
export const uploadImageDB = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const response = axios({
        method: 'post',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/imageUpload`,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        processData: false,
        contentType: false,
        data: file
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

// 댓글 목록 조회
export const infoCommentListDB = (infoNo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/commentList`,
        params: { infoNo }
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 댓글 등록
export const infoCommentInsertDB = (comment) => {
  console.log(comment); // 디버깅용 로그
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'post',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/commentInsert`,
        data: comment
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
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/commentUpdate`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: comment
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 댓글 삭제
export const infoCommentDeleteDB = (commentId) => {
  console.log("DeleteCommentDB called with:", commentId);
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'delete',
        url: `${process.env.REACT_APP_SPRING_IP}api/infoboard/commentDelete?commentId=${commentId}`,
        params: { commentId }
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};
