import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { boardListDB } from '../../services/counselLogic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import CounselItem from './CounselItem';
import CounselSidebar from './CounselSidebar';

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
    <div className="min-h-screen bg-[#e3e7d3] flex flex-col items-center p-6 relative">
      <div className="w-full max-w-5xl flex">
        <CounselSidebar className="w-1/4" />
        <div className="w-3/4 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0] mt-6 ml-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4 border-[#c2c8b0]">
            <h1 className="text-2xl font-semibold text-[#7c9473]">영양상담 게시판</h1>
            <div className="flex space-x-2">
              <input type="text" placeholder="검색어를 입력하세요" className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-[#93ac90] bg-white border-[#a8b18f] text-[#5f7a60]" id="keyword" />
              <button onClick={boardSearch} className="bg-[#93ac90] text-white px-4 py-2 rounded-lg hover:bg-[#7c9473] transition-all shadow-md">
                검색
              </button>
              <button onClick={() => navigate('/counsel/write')} className="bg-[#93ac90] text-white px-4 py-2 rounded-lg hover:bg-[#7c9473] transition-all shadow-md">
                글쓰기
              </button>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="bg-[#d7e3c7] text-[#5f7a60]">
              <tr>
                <th className="p-3 border-b border-[#c2c8b0] text-center w-[10%]">번호</th>
                <th className="p-3 border-b border-[#c2c8b0] text-center w-[40%]">제목</th>
                <th className="p-3 border-b border-[#c2c8b0] text-center w-[15%]">작성자</th>
                <th className="p-3 border-b border-[#c2c8b0] text-center w-[15%]">작성일</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-[#7c9473]">
                    게시글이 없습니다.
                  </td>
                </tr>
              ) : (
                currentItems.map((board, index) => <CounselItem key={index} board={board} page={currentPage} index={index} itemsPerPage={itemsPerPage} />)
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
                <button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={`w-10 h-10 flex items-center justify-center rounded-lg border ${currentPage === pageNumber ? 'bg-[#C1CFA1] text-[#706D54]' : 'bg-[#d7e3c7] text-[#706D54] hover:bg-gray-200 focus:ring-2 focus:ring-gray-400'}`}>
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
  );
};

export default CounselList;
