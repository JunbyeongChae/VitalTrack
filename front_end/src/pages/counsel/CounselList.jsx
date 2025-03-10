import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { boardListDB } from '../../services/dbLogic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import CounselDBItem from './CounselDBItem';

const CounselList = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const currentItems = (boards || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search); //쿼리스트링으로 가져오기
    const page = queryParams.get('page');
    if (page) setCurrentPage(parseInt(page)); //현재 내가 바라보는 페이지 정보 담기
  }, [navigate]);
  useEffect(() => {
    const asyncDB = async () => {
      try {
        const board = { gubun: null, keyword: null };
        const res = await boardListDB(board);
        console.log(res.data);
        setBoards(res.data || []); // 데이터가 없으면 빈 배열 할당
      } catch (error) {
        console.error('게시글 목록 불러오기 실패:', error);
        setBoards([]); // 에러 발생 시 빈 배열 할당
      }
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
              <th className="border px-4 py-2">글번호</th>
              <th className="border px-4 py-2">제목</th>
              <th className="border px-4 py-2">작성자</th>
              <th className="border px-4 py-2">작성일</th>
            </tr>
          </thead>
          <tbody>{Array.isArray(currentItems) && currentItems.map((board, index) => <CounselDBItem key={index} board={board} page={currentPage} />)}</tbody>
        </table>

        <div className="flex justify-center mt-4">
          <nav className="flex items-center space-x-1">
            {/* First 버튼 */}
            <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="px-3 py-1 rounded border disabled:opacity-50">
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </button>

            {/* Prev 버튼 */}
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded border disabled:opacity-50">
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>

            {/* 페이지 번호 버튼 */}
            {Array.from({ length: boards ? Math.ceil(boards.length / itemsPerPage) : 0 }, (_, i) => i + 1).map((pageNumber) => (
              <button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={`px-3 py-1 rounded border ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
                {pageNumber}
              </button>
            ))}

            {/* Next 버튼 */}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(boards ? boards.length / itemsPerPage : 0)} className="px-3 py-1 rounded border disabled:opacity-50">
              <FontAwesomeIcon icon={faAngleRight} />
            </button>

            {/* Last 버튼 */}
            <button onClick={() => handlePageChange(Math.ceil(boards ? boards.length / itemsPerPage : 0))} disabled={currentPage === Math.ceil(boards ? boards.length / itemsPerPage : 0)} className="px-3 py-1 rounded border disabled:opacity-50">
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </button>
          </nav>
        </div>

        <hr className="my-2" />
        <div className="list-footer flex justify-center space-x-2">
          <button className="btn btn-warning p-2 bg-yellow-500 text-white rounded" onClick={boardList}>
            전체조회
          </button>
          <button className="btn btn-success p-2 bg-green-500 text-white rounded" onClick={() => navigate('/counsel/write')}>
            상담글쓰기
          </button>
        </div>
      </div>
    </>
  );
};

export default CounselList;
