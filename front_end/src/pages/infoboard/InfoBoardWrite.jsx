import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import InfoSidebar from './InfoSidebar';
import TiptapEditor from '../../components/TiptapEditor';
import { toast } from 'react-toastify';
import { infoBoardInsertDB } from '../../services/infoBoardLogic.js';

const InfoBoardWrite = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const memNick = user.memNick || '';
  const memNo = user.memNo || '';

  const handleTitle = useCallback((e) => setTitle(e.target.value), []);
  const handleContent = useCallback((value) => setContent(value), []);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  const boardInsert = async () => {
    if (!title || !content || !selectedCategory) {
      toast.warn('제목, 내용, 분류를 모두 입력하세요.');
      return;
    }

    const board = {
      infoTitle: title,
      infoContent: content,
      infoCategory: selectedCategory,
      infoDate: getCurrentDate(),
      memNo: memNo
    };

    try {
      const res = await infoBoardInsertDB(board);
      if (res.data) {
        navigate('/healthInfo?page=1');
      } else {
        toast.warn('글쓰기 실패');
      }
    } catch (error) {
      console.error('서버 오류:', error);
      toast.error('서버 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용을 취소하시겠습니까?')) {
      navigate('/healthInfo');
    }
  };

  const handleGoToCommunity = () => {
    if (window.confirm('게시물 목록으로 이동 시 작성된 내용은 저장되지 않습니다.')) {
      navigate('/healthInfo');
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e7d3] flex flex-col items-center p-6 relative">
      <div className="w-full max-w-5xl flex">
        <InfoSidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        <div className="w-3/4 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0] mt-6 ml-6 h-auto">
          <h1 className="text-2xl font-semibold text-[#7c9473]"> 게시물 작성</h1>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6 mt-4">
            {/* 제목 */}
            <input
              type="text"
              value={title}
              onChange={handleTitle}
              className="w-full p-4 text-lg border border-[#a8b18f] bg-[#f2f5eb] rounded-xl focus:ring-2 focus:ring-[#93ac90]"
              placeholder="제목을 입력하세요"
              required
            />

            {/* 작성자와 분류 */}
            <div className="flex gap-4">
              <input
                type="text"
                value={memNick}
                readOnly
                className="w-1/2 min-w-[200px] p-4 text-lg border border-[#a8b18f] bg-gray-100 rounded-xl text-gray-700 cursor-not-allowed"
                placeholder="작성자"
              />
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-1/2 min-w-[200px] p-4 text-lg border border-[#a8b18f] bg-[#f2f5eb] rounded-xl focus:ring-2 focus:ring-[#93ac90]"
                required
              >
                <option value="">분류 선택</option>
                <option value="운동정보">운동정보</option>
                <option value="영양정보">영양정보</option>
                <option value="건강관리팁">건강관리팁</option>
              </select>
            </div>

            {/* 내용 */}
            <TiptapEditor value={content} handleContent={handleContent} />

            {/* 버튼 영역 */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleGoToCommunity}
                className="px-8 py-3 bg-indigo-600 text-white text-base font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm mx-2"
              >
                목록
              </button>
              <button
                onClick={boardInsert}
                className="px-8 py-3 bg-[#93ac90] text-white text-base font-semibold rounded-lg hover:bg-[#7c9473] transition-all shadow-sm mx-2"
              >
                작성
              </button>
              <button
                onClick={handleCancel}
                className="px-8 py-3 bg-[#e5d8bf] text-[#5f7a60] text-base font-semibold rounded-lg hover:bg-[#d7c7a8] transition-all shadow-sm mx-2"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InfoBoardWrite;
