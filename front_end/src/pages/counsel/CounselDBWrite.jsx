import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { boardInsertDB } from '../../services/dbLogic';
import TiptapEditor from './TiptapEditor';

const CounselDBWrite = () => {
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

  const handleTitle = useCallback((e) => setTitle(e), []);
  const handleContent = useCallback((e) => setContent(e), []);

  const boardInsert = async () => {
    if (!title || !content) {
      alert('제목과 내용을 모두 입력하세요.');
      return;
    }
    const board = {
      counselTitle: title,
      counselContent: content,
      counselDate: getCurrentDate(),
      memNo: memNo,
    };

    try {
      const res = await boardInsertDB(board);
      if (res.data) {
        navigate('/counsel?page=1');
      } else {
        alert('글쓰기 실패');
      }
    } catch (error) {
      console.error('서버 오류:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">1:1 상담 작성</h1>
      </header>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">제목</h3>
          <input
            id="dataset-title"
            type="text"
            maxLength="50"
            placeholder="제목을 입력하세요."
            onChange={(e) => handleTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">작성자</h3>
          <input
            id="dataset-writer"
            type="text"
            maxLength="20"
            value={memNick}
            readOnly
            className="w-1/3 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        <hr className="my-6 border-gray-300" />

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">내용</h3>
          <TiptapEditor value={content} handleContent={handleContent} />
        </div>

        <div className="flex justify-end">
          <button
            onClick={boardInsert}
            className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors duration-200 text-lg"
          >
            상담 등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounselDBWrite;
