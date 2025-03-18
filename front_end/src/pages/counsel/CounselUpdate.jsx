import React, { useCallback, useEffect, useRef, useState } from 'react';
import { boardDetailDB, boardUpdateDB } from '../../services/counselLogic';
import { useNavigate, useParams } from 'react-router-dom';
import TiptapEditor from './CounselTiptapEditor';
import { toast } from 'react-toastify';
import Sidebar from './CounselSidebar';

const CounselUpdate = () => {
  const navigate = useNavigate();
  const { counselNo } = useParams(); // 변수명 수정: 기존 b_no → counselNo
  const editorRef = useRef(null); // TiptapEditor 제어를 위한 Ref
  // 수정할 필드
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [memNick, setMemNick] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await boardDetailDB(counselNo);
        if (res.data && res.data.length > 0) {
          const board = res.data[0];
          setTitle(board.counselTitle || '');
          setContent(board.counselContent || '');
          setMemNick(board.memNick || '');
        }
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };
    fetchData();
  }, [counselNo]);

  // [중요] content가 변경되면 editor에 반영
  useEffect(() => {
    if (editorRef.current && content) {
      editorRef.current.commands.setContent(content);
    }
  }, [content]);

  // 이벤트 핸들러들
  const handleTitle = useCallback((value) => setTitle(value), []);
  const handleContent = useCallback((value) => setContent(value), []);

  const boardUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      toast.warn('제목과 내용을 모두 입력하세요.');
      return;
    }
    // counselNo, counselTitle, counselContent만 전달
    // memNick은 counsel 테이블 구조상 insert/update 대상이 아님
    const board = {
      counselNo: counselNo,
      counselTitle: title,
      counselContent: content
    };
    try {
      const res = await boardUpdateDB(board);
      // [주석] boardUpdateDB의 성공 여부 판단
      if (res.data === 1) {
        navigate('/counsel?page=1');
      } else {
        toast.warn('수정 실패하였습니다.');
      }
    } catch (error) {
      toast.error('수정 처리 중 오류 발생:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex">
      <div>
        <Sidebar />
      </div>
      <div className="flex-grow flex-col">
        <div className="page-header mb-4">
          <div className="p-6 bg-white rounded-lg shadow-lg h-screen">
            <h1 className="text-3xl font-bold mb-4">글 수정</h1>
            <hr className="my-2" />
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">제목</h2>
                <input type="text" maxLength="50" value={title} onChange={(e) => handleTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>

              <div>
                {/* 작성자 (읽기 전용) */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">작성자</h2>
                <input type="text" maxLength="20" value={memNick} readOnly className="w-1/4 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed" />
              </div>

              <hr className="my-6 border-gray-300" />

              {/* TiptapEditor로 내용 수정 */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">내용</h2>
                <TiptapEditor value={content} handleContent={handleContent} editorRef={editorRef} />
              </div>

              {/* 수정 버튼 */}
              <div className="flex justify-end">
                <button onClick={boardUpdate} className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors duration-200 text-lg">
                  수정 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselUpdate;
