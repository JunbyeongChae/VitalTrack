import axios from 'axios';

export const boardListDB = (board) => {
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'get',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/counselList',
        params: {
          memNo: board.memNo,
          admin: board.admin // 1 또는 0으로 전달
        }
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

export const boardDetailDB = (counsel_no) => {
  console.log(counsel_no);
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'get',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/counselboard/boardDetail?counsel_no=' + counsel_no
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
}; //end of boardDetailDB

export const boardInsertDB = (board) => {
  console.log(JSON.stringify(board));
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'post',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/counselboardInsert',
        data: board
      });
      resolve(res);
    } catch (error) {
      reject(error);
    } //end of try..catch
  }); //end of boardInsertDB
}; //end of boardInsertDB

export const boardUpdateDB = (board) => {
  //console.log(board)[Object Object]
  console.log('boardUpdateDB called with:', board); // 디버깅 로그 추가
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'put',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/counselboard/counselboardUpdate',
        data: board
      });
      //스프링에서 응답이 성공적으로 나오면 - 200OK
      resolve(res);
    } catch (error) {
      reject(error);
    } //end of try..catch
  }); //end of boardUpdateDB
}; //end of boardUpdateDB

export const boardDeleteDB = (counsel_no) => {
  //console.log(board)[Object Object]
  console.log(counsel_no); //JSON.stringify(), JSON.parse()
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'delete',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/counselboard/counselboardDelete?counsel_no=' + counsel_no
      });
      //스프링에서 응답이 성공적으로 나오면 - 200OK
      resolve(res);
    } catch (error) {
      reject(error);
    } //end of try..catch
  }); //end of boardDeleteDB
}; //end of boardDeleteDB

export const uploadImageDB = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const response = axios({
        method: 'post',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/imageUpload',
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

//댓글 쓰기 구현
export const reCommentInsertDB = (comment) => {
  console.log(comment);
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'post',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/commentInsert',
        data: comment
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
}; //end of reCommentInsertDB
// 댓글 수정 구현
export const reCommentUpdateDB = (cmt) => {
  //사용자가 입력한 값을 출력해 보기
  console.log(cmt);
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'put',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/counselboard/commentUpdate',
        data: cmt
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
}; //end of reCommentUpdateDB

//댓글삭제구현
export const reCommentDeleteDB = (bc_no) => {
  console.log(bc_no);
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'delete',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/counselboard/commentDelete?bc_no=' + bc_no
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
}; //end of reCommentDeleteDB
