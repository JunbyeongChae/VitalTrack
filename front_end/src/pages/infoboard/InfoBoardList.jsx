import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import InfoSidebar from './InfoSidebar';
import InfoBoardItem from './InfoBoardItem';
import { infoBoardListDB } from '../../services/infoBoardLogic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

const InfoBoardList = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [search, setSearch] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  // 로컬스토리지에서 user 정보 가져오기
  const isAdmin = user.admin === 1;

  const currentItems = (boards || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fetchBoardList = useCallback(async () => {
    try {
      const categoryFilter = selectedCategory === '전체' ? '' : selectedCategory;
      const board = { gubun: 'infoContent', keyword: search, category: categoryFilter };
      console.log('📌 API 요청:', board); // 디버깅 로그 추가
      const res = await infoBoardListDB(board);
      setBoards(res.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('게시글 목록 불러오기 실패:', error);
      setBoards([]);
    }
  }, [selectedCategory, search]);

  useEffect(() => {
    fetchBoardList();
  }, [selectedCategory, fetchBoardList]);

  const handleSearch = () => {
    fetchBoardList(selectedCategory, search); // 🔹 검색 시 현재 카테고리 유지
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/healthInfo?page=${pageNumber}`);
  };

  // 엔터 키 입력 시 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchBoardList();
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e7d3] flex flex-col items-center p-6 relative">
      {/* ✅ 반응형 처리: md:flex-row로 분기 */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row">
        <InfoSidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        {/* ✅ 반응형 처리: w-full md:w-3/4 적용 */}
        <div className="w-full md:w-3/4 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0] mt-6 md:mt-0 md:ml-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 border-[#c2c8b0]">
            <h1 className="text-2xl font-semibold text-[#7c9473] mb-2 sm:mb-0">건강 관리 게시판</h1>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <input type="text" placeholder="검색어를 입력하세요" className="w-full sm:w-auto border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-[#93ac90] bg-white border-[#a8b18f] text-[#5f7a60]" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown} />
              <button onClick={handleSearch} className="bg-[#93ac90] text-white px-4 py-2 rounded-lg hover:bg-[#7c9473] transition-all shadow-md">
                검색
              </button>
              {/* 관리자(admin=1)만 글쓰기 버튼 보이기 */}
              {isAdmin && (
                <button onClick={() => navigate('/healthInfo/write')} className="bg-[#93ac90] text-white px-4 py-2 rounded-lg hover:bg-[#7c9473] transition-all shadow-md">
                  글쓰기
                </button>
              )}
            </div>
          </div>

          {/* ✅ 반응형 grid 레이아웃 적용 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{currentItems.length > 0 ? currentItems.map((board, index) => <InfoBoardItem key={index} board={board} />) : <div className="col-span-full text-center text-[#7c9473] p-6">📭 해당 카테고리에 게시물이 없습니다.</div>}</div>

          <div className="flex justify-center mt-4">
            <nav className="flex flex-wrap justify-center items-center space-x-1">
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
  );
};

export default InfoBoardList;
