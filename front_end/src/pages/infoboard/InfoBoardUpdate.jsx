import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import InfoSidebar from './InfoSidebar';

const dummyPosts = [
  { id: 1, title: '홈트레이닝 팁', content: '운동 관련 정보입니다.' },
  { id: 2, title: '비타민 섭취 가이드', content: '영양 정보입니다.' },
  { id: 3, title: '스트레스 관리법', content: '건강 관리 팁입니다.' }
];

const InfoBoardUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  useEffect(() => {
    const post = dummyPosts.find((p) => p.id === Number(id));
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    } else {
      alert('게시글을 찾을 수 없습니다.');
      navigate('/healthInfo');
    }
  }, [id, navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (title.length < 5) {
      alert('제목은 최소 5자 이상 입력해주세요.');
      return;
    }

    alert('게시글이 수정되었습니다.');
    navigate('/healthInfo');
  };

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      navigate('/healthInfo');
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e7d3] flex flex-col items-center p-6 relative">
      <div className="w-full max-w-5xl flex">
        <InfoSidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        <div className="w-3/4 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border  border-[#c2c8b0] mt-6 ml-6">
          <h1 className="text-3xl font-semibold text-center text-[#7c9473] mb-6">✍️ 게시글 수정</h1>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 text-lg border border-[#a8b18f] bg-[#f2f5eb] rounded-xl focus:ring-2 focus:ring-[#93ac90] focus:outline-none transition-shadow shadow-sm" placeholder="제목을 입력하세요" required />
            </div>

            <div>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-4 text-lg border border-[#a8b18f] bg-[#f2f5eb] rounded-xl focus:ring-2 focus:ring-[#93ac90] focus:outline-none transition-shadow shadow-sm" placeholder="내용을 입력하세요" rows="6"></textarea>
            </div>

            <div className="flex flex-col space-y-3">
              <button type="submit" className="w-full py-3 bg-[#93ac90] text-white font-semibold rounded-xl hover:bg-[#7c9473] transition-all shadow-md">
                수정 완료
              </button>
              <button type="button" onClick={handleCancel} className="w-full py-3 bg-[#e5d8bf] text-[#5f7a60] font-semibold rounded-xl hover:bg-[#d7c7a8] transition-all shadow-md">
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
