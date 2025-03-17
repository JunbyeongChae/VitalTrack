import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import InfoSidebar from './InfoSidebar';

const postsData = [
  { id: 1, title: '첫 번째 게시물', author: '관리자', date: '2025-02-27', views: 123, content: '이것은 첫 번째 게시물의 내용입니다.' },
  { id: 2, title: '두 번째 게시물', author: '관리자1', date: '2025-02-26', views: 98, content: '이것은 두 번째 게시물의 내용입니다.' },
  { id: 3, title: '세 번째 게시물', author: '관리자2', date: '2025-02-25', views: 76, content: '이것은 세 번째 게시물의 내용입니다.' }
];

const InfoBoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const post = postsData.find((p) => p.id === Number(id));

  if (!post) {
    return <div className="text-center text-red-500 p-4">게시물을 찾을 수 없습니다.</div>;
  }

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      alert('게시물이 삭제되었습니다.');
      navigate('/healthInfo');
    }
  };

  const handleUpdate = () => {
    navigate(`/healthInfo/update/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#e3e7d3] flex flex-col items-center p-6 relative">
      <div className="w-full max-w-5xl flex">
        <InfoSidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        <div className="w-3/4 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0] mt-6 ml-6">
          {/* 게시물 정보 */}
          <h1 className={`text-3xl font-semibold ${post.isNotice ? 'text-[#d97706]' : 'text-[#000000]'}`}>{post.title}</h1>
          <div className="text-[#000000] mb-4">
            {post.author} · {post.date} · 조회수 {post.views}
          </div>
          <div className={`p-6 rounded-lg shadow-sm mb-6 ${post.isNotice ? 'bg-[#fdf3c3]' : 'bg-[#d7e3c7]'} text-[#000000]`}>{post.content}</div>

          {/* 수정 및 삭제 버튼 */}
          <div className="flex justify-end space-x-2 mb-6">
            <button className="p-3 bg-white text-[#5f7a60] border border-[#a8b18f] rounded-md hover:bg-[#f2f5eb] transition-all shadow-sm" onClick={handleUpdate}>
              수정
            </button>
            <button onClick={handleDelete} className="p-3 bg-[#e5d8bf] text-[#5f7a60] border hover:bg-[#d7c7a8] rounded-md transition-all shadow-sm">
              삭제
            </button>
          </div>

          {/* 댓글 영역 */}
          <div className="mt-8 p-6 bg-[#f2f5eb] rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-[#5f7a60]">💬 댓글 {comments.length}</h3>

            <div className="flex items-end mb-4">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-5/6 p-3 border border-[#a8b18f] rounded-lg bg-white text-[#5f7a60] focus:ring-2 focus:ring-[#93ac90]" placeholder="댓글을 입력하세요..." rows="4" style={{ resize: 'none' }} />
              <button className="ml-4 p-3 bg-[#93ac90] text-white rounded-lg hover:bg-[#7c9473] transition-all shadow-md" disabled>
                댓글 등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBoardDetail;
