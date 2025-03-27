import React, { useCallback, useEffect, useRef, useState } from 'react';
import { boardDetailDB, boardUpdateDB } from '../../services/counselLogic';
import { useNavigate, useParams } from 'react-router-dom';
import CounselTiptapEditor from './CounselTiptapEditor';
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
        toast.success('게시글이 수정되었습니다.');
        navigate(`/counsel/${counselNo}`);
      } else {
        toast.warn('수정 실패하였습니다.');
      }
    } catch (error) {
      toast.error('수정 처리 중 오류 발생:', error);
    }
  };

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      navigate('/counsel');
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e7d3] flex flex-col items-center p-6 relative">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
        {' '}
        {/* 수정 내용: 반응형 레이아웃 대응 (모바일 세로, PC 가로) */}
        <div className="w-full md:w-1/4">
          {' '}
          {/* 수정 내용: 사이드바 반응형 너비 처리 */}
          <Sidebar />
        </div>
        <div className="w-full md:w-3/4 md:mt-0 md:ml-6 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0] h-auto">
          {' '}
          {/* 수정 내용: 본문 패널 반응형 처리 */}
          <h1 className="text-2xl font-semibold text-[#7c9473] text-center"> 게시물 수정</h1>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6 mt-4">
            {/* 제목 */}
            <input type="text" value={title} onChange={(e) => handleTitle(e.target.value)} className="w-full p-4 text-lg border border-[#a8b18f] bg-[#f2f5eb] rounded-xl focus:ring-2 focus:ring-[#93ac90]" placeholder="제목을 입력하세요" required />

            {/* 작성자 */}
            <div className="flex gap-4 flex-wrap">
              {' '}
              {/* 수정 내용: 모바일에서 줄바꿈 가능하게 처리 */}
              <input type="text" value={memNick} readOnly className="w-full sm:w-1/2 min-w-[200px] p-4 text-lg border border-[#a8b18f] bg-gray-100 rounded-xl text-gray-700 cursor-not-allowed" placeholder="작성자" />
            </div>

            {/* 내용 */}
            <CounselTiptapEditor value={content} handleContent={handleContent} editorRef={editorRef} />

            {/* 버튼 영역 */}
            <div className="flex flex-wrap justify-end gap-4 mt-6">
              <button onClick={boardUpdate} className="px-8 py-3 bg-[#93ac90] text-white text-base font-semibold rounded-lg hover:bg-[#7c9473] transition-all shadow-sm">
                수정 완료
              </button>
              <button onClick={handleCancel} className="px-8 py-3 bg-[#e5d8bf] text-[#5f7a60] text-base font-semibold rounded-lg hover:bg-[#d7c7a8] transition-all shadow-sm">
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CounselUpdate;
