import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { boardListDB } from '../../service/dbLogic';

const CounselList = () => {
  const navigate = useNavigate();
  //조회 건수가 여러 건이므로 배열로 정의하였다.
  //3000번과 8000사이의 일어남. - 비동기 처리해야 함. -async, await
  const [boards, setBoards] = useState([]);
  //현재 내가 바라보는 페이지 정보 - 상세 페이지에서 다시 내가 있던 자리로 돌어갈때 필요한 값이다.
  const [currentPage, setCurrentPage] = useState(1);
  //한 페이지당 항목 수 - 전체 페이지 수를 계산할 수 있다.  45
  const itemsPerPage = 5;
  //현재 페이지 출력될  item 계산 - 이 값만큼만 반복문 돌리기
  const currentItems = boards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  //페이징 처리 결과에 따라서 화면을 매번 재렌더링 하기
  useEffect(() => {
    //URL에서 현재 페이지 번호 가져오기
    //localhost:3000/reboard?page=2
    const queryParams = new URLSearchParams(window.location.seach); //쿼리스트링으로 가져오기
    const page = queryParams.get('page'); //localhost:3000/reboard?page=2
    //자바스크립트에서는 0이면 false 아니면 다 true
    //쿼리스트링으로 넘어오는 값은 모두 다 string -> int
    if (page) setCurrentPage(parseInt(page)); //현재 내가 바라보는 페이지 정보 담기
    //의존성 배열에 들어있는 멤버 변수 값이 변하면 그 때마다 실행이 반복된다.
  }, [navigate]); //localhost:3000/reboard/update/12 -> 수정이 성공하면 localhost:3000/reboard?page=1
  //목록 페이지를 열자 마자 DB경유하는 코드는 어디서 어떻게 작성할까?
  useEffect(() => {
    const asyncDB = async () => {
      const board = { gubun: null, keyword: null };
      const res = await boardListDB(board);
      console.log(res.data);
      setBoards(res.data);
    };
    asyncDB();
  }, []);
  //게시글에 대한 조건 검색 구현
  const boardSearch = async () => {
    const gubun = document.querySelector('#gubun').value;
    const keyword = document.querySelector('#keyword').value;
    console.log(`${gubun}, ${keyword}`);
    const board = { gubun, keyword };
    const res = await boardListDB(board);
    console.log(res.data);
    setBoards(res.data);
    //검색시 첫 페이지로 이동하기
    setCurrentPage(1);
  }; //end of boardSearch
  const boardList = async () => {
    console.log('전체조회');
    const board = { gubun: null, keyword: null };
    const res = await boardListDB(board);
    setBoards(res.data);
    setCurrentPage(1);
  }; //end of boardList
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="page-header mb-4">
          <h1 className="text-2xl font-bold">영양상담 게시판</h1>
          <hr className="my-2" />
        </div>
        <div className="flex mb-4">
          <div className="w-1/4 pr-2">
            <select className="form-select w-full p-2 border border-gray-300 rounded" id="gubun">
              <option value="">분류선택</option>
              <option value="counsel_title">제목</option>
              <option value="counsel_content">내용</option>
            </select>
          </div>
          <div className="w-1/2 px-2">
            <input type="text" className="form-control w-full p-2 border border-gray-300 rounded" placeholder="검색어를 입력하세요" id="keyword" />
          </div>
          <div className="w-1/4 pl-2">
            <button type="button" className="btn btn-danger w-full p-2 bg-gray-600 text-white rounded" onClick={boardSearch}>
              검색
            </button>
          </div>
        </div>

        <table className="table-auto w-full mb-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">분류</th>
              <th className="border px-4 py-2">제목</th>
              <th className="border px-4 py-2">작성자</th>
            </tr>
          </thead>
        </table>

        <div className="d-flex justify-content-center mb-4">
          <table className="table-auto w-full mb-4">
            <tbody>
              <tr>
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">영양상담 예시 제목1</td>
                <td className="border px-4 py-2">홍길동</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">2</td>
                <td className="border px-4 py-2">영양상담 예시 제목2</td>
                <td className="border px-4 py-2">홍길동</td>
              </tr>
            </tbody>
          </table>
          <div className="d-flex justify-content-center">
            {/* <Pagination></Pagination> */}
          </div>
        </div>

        <hr className="my-2" />
        <div className="list-footer flex justify-center space-x-2">
          <button className="btn btn-warning p-2 bg-yellow-500 text-white rounded" onClick={boardList}>전체조회</button>
          <button className="btn btn-success p-2 bg-green-500 text-white rounded" >상담글쓰기</button>
        </div>
      </div>
    </>
  );
};

export default CounselList;
