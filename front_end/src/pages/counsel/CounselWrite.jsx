import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { boardInsertDB } from '../../services/counselLogic.js';
import { toast } from 'react-toastify';
import CounselSidebar from './CounselSidebar.jsx';
import CounselTiptapEditor from './CounselTiptapEditor.jsx';

const CounselWrite = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const memNick = user.memNick || '';
  const memNo = user.memNo || '';

  // 현재 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  const handleTitle = useCallback((e) => setTitle(e.target.value), []);
  const handleContent = useCallback((html) => setContent(html), []); // 수정된 부분

  const boardInsert = async () => {
    console.log('boardInsert from CounselDBWrite');
    if (!title || !content) {
      toast.warn('제목과 내용을 모두 입력하세요.');
      return;
    }
    const board = {
      counselTitle: title,
      counselContent: content,
      counselDate: getCurrentDate(),
      memNo: memNo
    };

    try {
      const res = await boardInsertDB(board);
      if (res.data) {
        navigate('/counsel?page=1');
      } else {
        toast.warn('글쓰기 실패');
      }
    } catch (error) {
      console.error('서버 오류:', error);
      toast.error('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e7d3] flex flex-col items-center p-6 relative">
      <div className="w-full max-w-5xl flex">
        <CounselSidebar />

        <div className="w-3/4 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0] mt-6 ml-6 h-auto">
          <h1 className="text-2xl font-semibold text-[#7c9473]"> 상담 작성</h1>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6 mt-4">
            <input type="text" value={title} onChange={handleTitle} className="w-full p-4 text-lg border border-[#a8b18f] bg-[#f2f5eb] rounded-xl focus:ring-2 focus:ring-[#93ac90]" placeholder="제목을 입력하세요" required />

            <div className="flex gap-4">
              <input type="text" value={memNick} readOnly className="w-1/2 p-4 text-lg border border-[#a8b18f] bg-gray-100 rounded-xl text-gray-700 cursor-not-allowed" placeholder="작성자" />
            </div>

            <CounselTiptapEditor value={content} handleContent={handleContent} />

            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => navigate('/counsel')} className="px-8 py-3 bg-gray-500 text-white text-base font-semibold rounded-lg hover:bg-gray-700 transition-all shadow-sm mx-2">
                목록
              </button>
              <button onClick={boardInsert} className="px-8 py-3 bg-[#93ac90] text-white text-base font-semibold rounded-lg hover:bg-[#7c9473] transition-all shadow-sm mx-2">
                작성
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CounselWrite;
