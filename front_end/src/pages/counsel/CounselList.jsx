import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { boardListDB } from '../../services/counselLogic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import CounselDBItem from './CounselItem';
import Sidebar from './CounselSidebar';

const CounselList = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const memNo = user.memNo || '';

  const currentItems = (boards || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const asyncDB = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const board = { memNo: user.memNo, admin: user.admin };
        const res = await boardListDB(board);
        setBoards(res.data || []);
      } catch (error) {
        console.error('게시글 목록 불러오기 실패:', error);
        setBoards([]);
      }
    };
    asyncDB();
  }, []);
  //게시글에 대한 조건 검색 구현
  const boardSearch = async () => {
    const gubun = document.querySelector('#gubun').value;
    const keyword = document.querySelector('#keyword').value;
    console.log(`${gubun}, ${keyword}`);
    const board = { gubun, keyword, memNo: memNo };
    const res = await boardListDB(board);
    console.log(res.data);
    setBoards(res.data);
    //검색시 첫 페이지로 이동하기
    setCurrentPage(1);
    navigate('/counsel?page=1');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/counsel?page=${pageNumber}`);
  };

  return (
    <div className="container mx-auto p-4 flex">
      <div>
        <Sidebar />
      </div>
      <div className="flex-grow flex-col">
        <div className="page-header mb-4">
          <div className="p-6 bg-white rounded-lg shadow-lg h-screen">
            <h1 className="text-3xl font-bold mb-4">영양상담 게시판</h1>
            <hr className="my-2" />

            <div className="flex mb-4 flex-wrap gap-2">
              <div className="basis-[15%] min-w-[120px] pr-2">
                <select className="form-select w-full p-2 border border-gray-300 rounded-lg" id="gubun">
                  <option value="">분류선택</option>
                  <option value="counselTitle">제목</option>
                  <option value="counselContent">내용</option>
                </select>
              </div>
              <div className="basis-[50%] min-w-[200px] px-2">
                <input type="text" className="form-control w-full p-2 border border-gray-300 rounded-lg" placeholder="검색어를 입력하세요" id="keyword" />
              </div>
              <div className="basis-[30%] min-w-[200px] pl-2 flex gap-2">
                <button type="button" className="w-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={boardSearch}>
                  검색
                </button>
                <button className="w-1/2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400" onClick={() => navigate('/counsel/write')}>
                  상담글쓰기
                </button>
              </div>
            </div>

            <table className="table-auto w-full mb-4">
              <thead>
                <tr>
                  <th className="border px-2 py-2 w-1/12 text-center">번호</th>
                  <th className="border px-4 py-2 w-6/12">제목</th>
                  <th className="border px-2 py-2 w-2/12 text-center">작성자</th>
                  <th className="border px-2 py-2 w-3/12 text-center">작성일</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      게시글이 없습니다.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((board, index) => <CounselDBItem key={index} board={board} page={currentPage} index={index} itemsPerPage={itemsPerPage} />)
                )}
              </tbody>
            </table>

            <div className="flex justify-center mt-4">
              <nav className="flex items-center space-x-1">
                {/* First 버튼 */}
                <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center rounded-lg border bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400">
                  <FontAwesomeIcon icon={faAngleDoubleLeft} size="lg" />
                </button>

                {/* Prev 버튼 */}
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className="w-10 h-10 flex items-center justify-center rounded-lg border bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400">
                  <FontAwesomeIcon icon={faAngleLeft} size="lg" />
                </button>

                {/* 페이지 번호 버튼 */}
                {Array.from({ length: Math.ceil(boards.length / itemsPerPage) }, (_, i) => i + 1).map((pageNumber) => (
                  <button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={`w-10 h-10 flex items-center justify-center rounded-lg border ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white text-black hover:bg-gray-200 focus:ring-2 focus:ring-gray-400'}`}>
                    {pageNumber}
                  </button>
                ))}

                {/* Next 버튼 */}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= Math.ceil(boards.length / itemsPerPage)} className="w-10 h-10 flex items-center justify-center rounded-lg border bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400">
                  <FontAwesomeIcon icon={faAngleRight} color="#5f7a60" />
                </button>

                {/* Last 버튼 */}
                <button onClick={() => handlePageChange(Math.ceil(boards.length / itemsPerPage))} disabled={currentPage >= Math.ceil(boards.length / itemsPerPage)} className="w-10 h-10 flex items-center justify-center rounded-lg border bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400">
                  <FontAwesomeIcon icon={faAngleDoubleRight} size="lg" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselList;
