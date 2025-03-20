import axios from 'axios';


// 게시판 목록 조회 api
export const boardListDB = (board) => {
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'get',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/counselList',
        params: {
          memNo: board.memNo,
          admin: board.admin, // 1 또는 0으로 전달
          gubun: board.gubun || '',    // gubun 추가
          keyword: board.keyword || '', // keyword 추가
        },
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 게시판 상세 조회 api
export const boardDetailDB = (counselNo) => {
  console.log(counselNo); // 디버깅용 로그
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'get',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/counselboardDetail?counselNo=' + counselNo,
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 게시판 등록 api
export const boardInsertDB = (board) => {
  console.log(JSON.stringify(board)); // 디버깅용 출력
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'post',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/counselboardInsert',
        data: board,
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 게시판 수정 api
export const boardUpdateDB = (board) => {
  console.log('boardUpdateDB called with:', board); // 디버깅 로그 추가
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'put',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/counselboardUpdate',
        data: board,
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 게시판 삭제 api
export const boardDeleteDB = (counselNo) => {
  console.log(counselNo); // 디버깅용 출력
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'delete',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/counselboardDelete?counselNo=' + counselNo,
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
        url: `${process.env.REACT_APP_SPRING_IP}api/counsel/imageUpload`,
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

// 댓글 작성 api
export const commentInsertDB = (comment) => {
  console.log(comment); // 디버깅용 출력
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'post',
        url: `${process.env.REACT_APP_SPRING_IP}api/counsel/commentInsert`,
        data: comment,
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 댓글 수정 api
export const commentUpdateDB = (cmt) => {
  console.log("📌 요청 데이터:", JSON.stringify(cmt)); // 디버깅 로그 추가
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'put',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/commentUpdate',
        headers: { "Content-Type": "application/json" }, // JSON 형식 명시
        data: cmt,
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

// 댓글 삭제 api
export const commentDeleteDB = (answerId) => {
  console.log(answerId); // 디버깅용 출력
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'delete',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/commentDelete?answerId=' + answerId, // 변수명 수정됨
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};
