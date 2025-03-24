import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import InfoSidebar from './InfoSidebar';
import { toast } from 'react-toastify';
import { infoBoardDetailDB, infoBoardUpdateDB } from '../../services/infoBoardLogic';
import InfoBoardTiptapEditor from './InfoBoardTiptapEditor.jsx';

const InfoBoardUpdate = () => {
  const { infoNo } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const memNick = user.memNick || '';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!infoNo) return;
        const response = await infoBoardDetailDB(infoNo);
        if (response.data) {
          setTitle(response.data.infoTitle);
          setContent(response.data.infoContent);
          setSelectedCategory(response.data.infoCategory || '');

          // 기존 썸네일이 유튜브 URL이라면 미리보기로 설정
          if (response.data.infoFile && response.data.infoFile.includes('img.youtube.com')) {
            setThumbnailUrl(response.data.infoFile);
          }
        } else {
          toast.error('게시글을 찾을 수 없습니다.');
          navigate('/healthInfo');
        }
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        toast.error('게시글 불러오기 실패');
        navigate('/healthInfo');
      }
    };
    fetchPost();
  }, [infoNo, navigate]);

  const handleTitle = useCallback((e) => setTitle(e.target.value), []);

  // 본문 내용 중 유튜브 링크 자동 감지 및 썸네일 URL 설정
  const handleContent = useCallback((value) => {
    setContent(value);

    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = value.match(youtubeRegex);
    if (match && match[1]) {
      const videoId = match[1];
      const generatedUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
      setThumbnailUrl(generatedUrl); // 대표 이미지용 썸네일 URL 설정
    }
  }, []);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  // 카테고리를 선택하면 리스트 페이지로 이동하는 함수 추가
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    navigate('/healthInfo?page=1'); // 리스트 페이지로 이동
  };

  const handleUpdate = async () => {
    if (!title || !content || !selectedCategory) {
      toast.warn('제목, 내용, 분류를 모두 입력하세요.');
      return;
    }

    let uploadedImageName = null;

    const updatedBoard = {
      infoNo: infoNo,
      infoTitle: title,
      infoContent: content,
      infoCategory: selectedCategory,
      infoFile: uploadedImageName || thumbnailUrl || null
    };

    try {
      const response = await infoBoardUpdateDB(updatedBoard);
      if (response.data) {
        toast.success('게시글이 수정되었습니다.');
        navigate(`/healthInfo/${infoNo}`);
      } else {
        toast.warn('게시글 수정 실패');
      }
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      toast.error('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      navigate('/healthInfo');
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e7d3] flex flex-col items-center p-6 relative">
      <div className="w-full max-w-5xl flex">
        <InfoSidebar selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />

        <div className="w-3/4 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0] mt-6 ml-6 h-auto">
          <h1 className="text-2xl font-semibold text-[#7c9473] text-center"> 게시물 수정</h1>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6 mt-4">
            {/* 제목 */}
            <input type="text" value={title} onChange={handleTitle} className="w-full p-4 text-lg border border-[#a8b18f] bg-[#f2f5eb] rounded-xl focus:ring-2 focus:ring-[#93ac90]" placeholder="제목을 입력하세요" required />

            {/* 작성자와 분류 */}
            <div className="flex gap-4">
              <input type="text" value={memNick} readOnly className="w-1/2 min-w-[200px] p-4 text-lg border border-[#a8b18f] bg-gray-100 rounded-xl text-gray-700 cursor-not-allowed" placeholder="작성자" />
              <select value={selectedCategory} onChange={handleCategoryChange} className="w-1/2 min-w-[200px] p-4 text-lg border border-[#a8b18f] bg-[#f2f5eb] rounded-xl focus:ring-2 focus:ring-[#93ac90]" required>
                <option value="">분류 선택</option>
                <option value="운동정보">운동정보</option>
                <option value="영양정보">영양정보</option>
                <option value="건강관리팁">건강관리팁</option>
              </select>
            </div>

            {/* 썸네일 미리보기 */}
            {thumbnailUrl && (
              <div>
                <label className="block text-sm font-medium text-[#5f7a60] mb-2">유튜브 썸네일 미리보기</label>
                <img src={thumbnailUrl} alt="썸네일 미리보기" className="w-60 h-60 object-cover rounded-lg border" />
              </div>
            )}

            {/* 내용 */}
            <InfoBoardTiptapEditor value={content} handleContent={handleContent} />

            {/* 버튼 영역 */}
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={handleUpdate} className="px-8 py-3 bg-[#93ac90] text-white text-base font-semibold rounded-lg hover:bg-[#7c9473] transition-all shadow-sm mx-2">
                수정 완료
              </button>
              <button onClick={handleCancel} className="px-8 py-3 bg-[#e5d8bf] text-[#5f7a60] text-base font-semibold rounded-lg hover:bg-[#d7c7a8] transition-all shadow-sm mx-2">
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InfoBoardUpdate;
