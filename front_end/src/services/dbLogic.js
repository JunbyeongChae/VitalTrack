import axios from 'axios';

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
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/commentUpdate',
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
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/commentDelete?bc_no='+bc_no
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
}; //end of reCommentDeleteDB

//http://localhost:8000/api/counsel/boardList
export const boardListDB = (board) => {
  //console.log(board)[Object Object]
  console.log(JSON.stringify(board)); //JSON.stringify(), JSON.parse()
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'get',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/counselList',
        params: board
      });
      //스프링에서 응답이 성공적으로 나오면 - 200OK
      resolve(res);
    } catch (error) {
      reject(error);
    } //end of try..catch
  }); //end of boardListDB
}; //end of boardListDB

export const boardDetailDB = (counsel_no) => {
  console.log(counsel_no);
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'get',
        //REACT_APP_SPRING_IP=http://localhost:8000/
        //@RequestMapping("/api/*") - CORS 이슈 해결하기 위한 접두어
        //@GetMapping("board/boardDetail")
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/boardDetail?counsel_no=' + counsel_no
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
}; //end of boardDetailDB

//http://localhost:8000/api/counsel/boardInsert
export const boardInsertDB = (board) => {
  //console.log(board)[Object Object]
  console.log(JSON.stringify(board)); //JSON.stringify(), JSON.parse()
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'post',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/boardInsert',
        data: board
      });
      //스프링에서 응답이 성공적으로 나오면 - 200OK
      resolve(res);
    } catch (error) {
      reject(error);
    } //end of try..catch
  }); //end of boardInsertDB
}; //end of boardInsertDB

//http://localhost:8000/api/counsel/boardUpdate
export const boardUpdateDB = (board) => {
  //console.log(board)[Object Object]
  console.log('boardUpdateDB called with:', board); // 디버깅 로그 추가
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'put',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/boardUpdate',
        data: board
      });
      //스프링에서 응답이 성공적으로 나오면 - 200OK
      resolve(res);
    } catch (error) {
      reject(error);
    } //end of try..catch
  }); //end of boardUpdateDB
}; //end of boardUpdateDB

//http://localhost:8000/api/counsel/boardDelete?counsel_no=
export const boardDeleteDB = (counsel_no) => {
  //console.log(board)[Object Object]
  console.log(counsel_no); //JSON.stringify(), JSON.parse()
  return new Promise((resolve, reject) => {
    try {
      const res = axios({
        method: 'delete',
        url: process.env.REACT_APP_SPRING_IP + 'api/counsel/boardDelete?counsel_no=' + counsel_no
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
