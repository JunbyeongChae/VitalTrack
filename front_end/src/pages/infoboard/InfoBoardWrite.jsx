import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import InfoSidebar from './InfoSidebar';
import { toast } from 'react-toastify';
import { infoBoardInsertDB } from '../../services/infoBoardLogic.js';
import InfoBoardTiptapEditor from './InfoBoardTiptapEditor.jsx';

const InfoBoardWrite = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null); // 썸네일 이미지 상태 추가
  const [previewUrl, setPreviewUrl] = useState(''); // 썸네일 미리보기 URL 상태 추가

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const memNick = user.memNick || '';
  const memNo = user.memNo || '';

  const handleTitle = useCallback((e) => setTitle(e.target.value), []);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  // 유튜브 썸네일 자동 추출
  const handleContent = useCallback((value) => {
    setContent(value);
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = value.match(youtubeRegex);
    if (match && match[1]) {
      const videoId = match[1];
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
      setPreviewUrl(thumbnailUrl); // 미리보기용 이미지 설정
      setThumbnail(thumbnailUrl); // infoFile로 저장할 URL
    }
  }, []);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  // 글 등록 처리 (유튜브 썸네일 URL 사용)
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
      memNo: memNo,
      infoFile: typeof thumbnail === 'string' ? thumbnail : null // URL 형식만 저장
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
      {/* ✅ 반응형 레이아웃 적용 */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row">
        <InfoSidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        {/* ✅ 본문 반응형 */}
        <div className="w-full md:w-3/4 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0] mt-6 md:mt-0 md:ml-6 h-auto">
          <h1 className="text-2xl font-semibold text-[#7c9473]"> 게시물 작성</h1>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6 mt-4">
            {/* 제목 */}
            <input type="text" value={title} onChange={handleTitle} className="w-full p-4 text-lg border border-[#a8b18f] bg-[#f2f5eb] rounded-xl focus:ring-2 focus:ring-[#93ac90]" placeholder="제목을 입력하세요" required />

            {/* 작성자와 분류 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <input type="text" value={memNick} readOnly className="w-full sm:w-1/2 min-w-[200px] p-4 text-lg border border-[#a8b18f] bg-gray-100 rounded-xl text-gray-700 cursor-not-allowed" placeholder="작성자" />
              <select value={selectedCategory} onChange={handleCategoryChange} className="w-full sm:w-1/2 min-w-[200px] p-4 text-lg border border-[#a8b18f] bg-[#f2f5eb] rounded-xl focus:ring-2 focus:ring-[#93ac90]" required>
                <option value="">분류 선택</option>
                <option value="운동정보">운동정보</option>
                <option value="영양정보">영양정보</option>
                <option value="건강관리팁">건강관리팁</option>
              </select>
            </div>

            {/* 유튜브 썸네일 미리보기 영역 */}
            {previewUrl && (
              <div>
                <label className="block text-sm font-medium text-[#5f7a60] mb-2">유튜브 썸네일 미리보기</label>
                <img src={previewUrl} alt="유튜브 썸네일" className="w-60 h-60 object-cover rounded-lg border" />
              </div>
            )}

            {/* 내용 */}
            <InfoBoardTiptapEditor value={content} handleContent={handleContent} />

            {/* 버튼 영역 */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6">
              <button onClick={handleGoToCommunity} className="px-6 py-3 bg-indigo-600 text-white text-base font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm">
                목록
              </button>
              <button onClick={boardInsert} className="px-6 py-3 bg-[#93ac90] text-white text-base font-semibold rounded-lg hover:bg-[#7c9473] transition-all shadow-sm">
                작성
              </button>
              <button onClick={handleCancel} className="px-6 py-3 bg-[#e5d8bf] text-[#5f7a60] text-base font-semibold rounded-lg hover:bg-[#d7c7a8] transition-all shadow-sm">
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
