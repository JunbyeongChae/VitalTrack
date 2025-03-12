import React, { useCallback, useEffect, useRef, useState } from 'react';
import { boardDetailDB, boardUpdateDB } from '../../services/dbLogic';
import { useNavigate, useParams } from 'react-router-dom';
import TiptapEditor from './TiptapEditor';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS

const CounselDBUpdate = () => {
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
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <ToastContainer position="top-left" theme="colored" autoClose={3000} hideProgressBar closeOnClick pauseOnFocusLoss="false" pauseOnHover />
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">게시글 수정</h1>
      </header>

      <div className="space-y-4">
        {/* 제목 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">제목</h3>
          <input type="text" maxLength="50" value={title} onChange={handleTitle} className="w-full p-3 border border-gray-300 rounded-lg" />
        </div>

        {/* 작성자 (읽기 전용) */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">작성자</h3>
          <input type="text" maxLength="20" value={memNick} readOnly className="w-1/3 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed" />
        </div>

        <hr className="my-6 border-gray-300" />

        {/* TiptapEditor로 내용 수정 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">내용</h3>
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
  );
};

export default CounselDBUpdate;
