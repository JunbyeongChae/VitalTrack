import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { infoBoardDetailDB, infoCommentListDB, infoBoardDeleteDB, infoCommentInsertDB, infoCommentDeleteDB, infoCommentUpdateDB } from '../../services/infoBoardLogic';
import InfoSidebar from './InfoSidebar';
import { toast } from 'react-toastify';

const InfoBoardDetail = () => {
  const { infoNo } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editingComment, setEditingComment] = useState(null);

  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        if (!infoNo) return;
        const response = await infoBoardDetailDB(infoNo);
        if (response.data) {
          setBoard(response.data);
        } else {
          toast.error('게시글을 찾을 수 없습니다.'); // 오류 메시지 추가
          navigate('/healthInfo'); // 게시글 없을 경우 목록으로 이동
        }
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        toast.error('게시글 불러오기 실패'); // 오류 메시지 추가
        navigate('/healthInfo');
      }
    };

    const fetchComments = async () => {
      if (!infoNo) {
        console.error('❌ infoNo가 없습니다.');
        return;
      }
      try {
        const response = await infoCommentListDB(infoNo);
        setComments(response.data || []);
      } catch (error) {
        console.error('❌ 댓글 불러오기 실패:', error.response?.data || error.message);
        toast.error('댓글을 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchBoardDetail();
    fetchComments();
  }, [infoNo, navigate]);

  // 게시글 삭제 로직
  const handleDelete = async () => {
    try {
      await infoBoardDeleteDB(infoNo);
      toast.success('게시글이 삭제되었습니다.'); // 삭제 성공 메시지 추가
      navigate('/healthInfo');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      toast.error('게시글 삭제 중 오류가 발생했습니다.'); // 오류 메시지 추가
    }
  };

  // 댓글 등록 함수
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      toast.warn('댓글 내용을 입력하세요.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const memNo = user.memNo || '';

    if (!memNo) {
      toast.warn('로그인이 필요합니다.');
      return;
    }

    const commentData = {
      infoNo: infoNo,
      memNo: memNo,
      commentContent: newComment
    };

    try {
      const response = await infoCommentInsertDB(commentData);

      if (response.status === 200) {
        toast.success('댓글이 등록되었습니다.');
        setNewComment(''); // 입력 필드 초기화

        // 댓글 목록 다시 불러오기
        infoCommentListDB(infoNo)
          .then((updatedComments) => setComments(updatedComments.data || []))
          .catch((err) => console.error('❌ 댓글 목록 갱신 실패:', err));
      } else {
        toast.warn('댓글 등록 실패');
      }
    } catch (error) {
      console.error('❌ 댓글 등록 실패:', error);
      toast.error('댓글 등록 중 오류가 발생했습니다.');
    }
  };

  // 카테고리를 선택하면 리스트 페이지로 이동하는 함수 추가
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    navigate('/healthInfo?page=1'); // 리스트 페이지로 이동
  };

  // 엔터 키 입력 시 댓글 등록
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommentSubmit();
    }
  };

  // 댓글 수정 기능
  const handleEditComment = (comment) => {
    setEditingComment(comment.commentId);
    setEditContent(comment.commentContent);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) {
      toast.warn('수정할 내용을 입력하세요.');
      return;
    }

    try {
      await infoCommentUpdateDB({ commentId, commentContent: editContent });
      toast.success('댓글이 수정되었습니다.');
      setEditingComment(null);
      infoCommentListDB(infoNo)
        .then((updatedComments) => setComments(updatedComments.data || []))
        .catch((err) => console.error('❌ 댓글 목록 갱신 실패:', err));
    } catch (error) {
      console.error('❌ 댓글 수정 실패:', error);
      toast.error('댓글 수정 중 오류가 발생했습니다.');
    }
  };

  // 댓글 삭제 기능
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) return;

    try {
      await infoCommentDeleteDB(commentId);
      toast.success('댓글이 삭제되었습니다.');
      infoCommentListDB(infoNo)
        .then((updatedComments) => setComments(updatedComments.data || []))
        .catch((err) => console.error('❌ 댓글 목록 갱신 실패:', err));
    } catch (error) {
      console.error('❌ 댓글 삭제 실패:', error);
      toast.error('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e7d3] flex flex-col items-center p-6 relative">
      <div className="w-full max-w-5xl flex">
        <InfoSidebar selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />

        <div className="w-3/4 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0] mt-6 ml-6">
          {/* 게시글 제목 및 버튼 정렬 */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-[#7c9473] pb-4">{board.infoTitle || '로딩 중...'}</h1>
            <div className="flex space-x-2">
              <button onClick={() => navigate('/healthInfo')} className="px-6 py-2 bg-[#ACA7AF] text-white font-semibold rounded-lg hover:bg-[#A190AB] transition-all shadow-md">
                목록
              </button>
              <button onClick={() => navigate(`/healthInfo/update/${infoNo}`)} className="px-6 py-2 bg-[#7c9473] text-white font-semibold rounded-lg hover:bg-[#93ac90] transition-all shadow-md">
                수정
              </button>
              <button onClick={handleDelete} className="px-6 py-2 bg-[#e5d8bf] text-[#5f7a60] font-semibold rounded-lg hover:bg-[#d7c7a8] transition-all shadow-md">
                삭제
              </button>
            </div>
          </div>

          <hr className="my-2" />

          {/* 작성자 및 분류 표시 */}
          <div className="flex justify-between items-center text-[#5f7a60] mt-4 mb-6">
            <div className="text-lg">
              <span className="font-semibold">작성자:</span> {board.memNick || '알 수 없음'}
              <span className="ml-4 font-semibold">분류:</span> {board.infoCategory || '없음'}
            </div>
            <div className="text-sm text-gray-600">{board.infoDate || '날짜 없음'}</div>
          </div>

          {/* 게시글 내용 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#c2c8b0]">
            <div className="text-lg text-[#5f7a60] whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: board.infoContent || '내용을 불러오는 중입니다.' }} />
          </div>

          {/* 댓글 섹션 */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-[#7c9473] mb-4">댓글</h2>
            <div className="bg-white p-4 rounded-lg shadow-md border border-[#c2c8b0]">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.commentId} className="p-3 border-b border-gray-300 flex justify-between items-center">
                    {editingComment === comment.commentId ? <input type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} className="flex-grow p-2 border border-gray-300 rounded-lg" /> : <p className="text-sm">{comment.commentContent}</p>}
                    <div className="flex space-x-2">
                      {editingComment === comment.commentId ? (
                        <button onClick={() => handleUpdateComment(comment.commentId)} className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg">
                          저장
                        </button>
                      ) : (
                        <button onClick={() => handleEditComment(comment)} className="px-6 py-2 bg-[#7c9473] text-white font-semibold rounded-lg hover:bg-[#93ac90] transition-all shadow-md">
                          수정
                        </button>
                      )}
                      <button onClick={() => handleDeleteComment(comment.commentId)} className="px-6 py-2 bg-[#e5d8bf] text-[#5f7a60] font-semibold rounded-lg hover:bg-[#d7c7a8] transition-all shadow-md">
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">등록된 댓글이 없습니다.</p>
              )}
            </div>

            {/* 댓글 입력창 및 버튼 정렬 */}
            <div className="mt-4 flex items-center space-x-2">
              {/* 댓글 입력창 */}
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="flex-grow p-3 border border-gray-300 rounded-lg resize-none h-16" placeholder="댓글을 입력하세요..." />

              {/* 댓글 등록 버튼 */}
              <button onClick={handleCommentSubmit} onKeyDown={handleKeyDown} className="h-16 px-6 bg-[#7c9473] text-white font-semibold rounded-lg hover:bg-[#93ac90] transition-all shadow-md">
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
