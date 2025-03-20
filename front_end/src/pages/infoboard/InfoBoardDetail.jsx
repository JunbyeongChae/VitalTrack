import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { infoBoardDetailDB, infoBoardDeleteDB, infoCommentInsertDB, infoCommentUpdateDB, infoCommentDeleteDB } from '../../services/infoBoardLogic';
import InfoSidebar from './InfoSidebar';
import { toast } from 'react-toastify';

const InfoBoardDetail = () => {
  const { infoNo } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState({});
  const [comments, setComments] = useState([]);

  // 답변작성 관련 상태
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // 로그인정보 가져오기
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const memNo = user.memNo || '';

  const fetchBoardDetail = useCallback(async () => {
    try {
      const res = await infoBoardDetailDB(infoNo);
      if (res.data && res.data.length > 0) {
        const boardData = res.data.find((item) => item.infoNo === parseInt(infoNo));
        if (boardData) setBoard(boardData);

        const commentIndex = res.data.findIndex((item) => item.comments);
        if (commentIndex !== -1) {
          setComments(res.data[commentIndex].comments);
        } else {
          setComments([]);
        }
      }
    } catch (error) {
      toast.error('게시글 상세 조회 오류!');
    }
  }, [infoNo]);

  useEffect(() => {
    fetchBoardDetail();
  }, [infoNo, fetchBoardDetail]);

  // 게시글 삭제 로직
  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await infoBoardDeleteDB(infoNo);
        toast.success('게시글이 삭제되었습니다.'); // 삭제 성공 메시지 추가
        navigate('/healthInfo');
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
        toast.error('게시글 삭제 중 오류가 발생했습니다.'); // 오류 메시지 추가
      }
    }
  };

  // 댓글 등록 함수
  const handleCommentSubmit = async () => {
    if (!newComment || newComment.trim() === '') {
      toast.warn('답변 내용을 입력하세요.');
      return;
    }
    if (!memNo) {
      toast.warn('로그인 후 이용 가능합니다.');
      return;
    }

    const formattedComment = newComment.replace(/\n/g, '<br>');

    const commentData = {
      infoNo: parseInt(infoNo),
      memNo: memNo,
      commentContent: formattedComment
    };

    try {
      const res = await infoCommentInsertDB(commentData);
      if (res.status === 200) {
        toast.success('댓글이 등록되었습니다.');
        setNewComment(''); // 입력 필드 초기화
        fetchBoardDetail();
      } else {
        toast.warn('댓글 등록 실패');
      }
    } catch (error) {
      console.error('댓글 등록 중 오류 발생:', error);
      toast.error('댓글 등록 중 오류가 발생했습니다.');
    }
  };

  // 카테고리를 선택하면 리스트 페이지로 이동하는 함수 추가
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    navigate('/healthInfo?page=1'); // 리스트 페이지로 이동
  };

  // 댓글 수정 기능
  const startEditing = (commentId, content) => {
    // HTML 태그 제거 및 줄바꿈 처리
    const plainTextContent = content.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '');
    setEditingCommentId(commentId);
    setEditingCommentContent(plainTextContent);
  };

  const handleUpdateComment = async () => {
    if (!editingCommentContent.trim()) {
      toast.warn('수정할 내용을 입력하세요.');
      return;
    }

    const formattedComment = editingCommentContent.replace(/\n/g, '<br>');

    // 현재 로그인한 사용자 정보 가져오기
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const currentUserMemNo = user.memNo;

    const updatedComment = {
      answerId: editingCommentId,
      answerContent: formattedComment,
      memNo: currentUserMemNo
    };

    try {
      const res = await infoCommentUpdateDB(updatedComment);
      if (res.status === 200) {
        toast.success('댓글이 수정되었습니다.');
        setEditingCommentId(null);
      } else {
        toast.error(res.data || '수정 권한이 없습니다.');
      }
    } catch (error) {
      toast.error('댓글 수정 중 오류 발생.');
    }
  };

  // 댓글 삭제 기능
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) {
      try {
        const res = await infoCommentDeleteDB(commentId);
        if (res.data === 1) {
          toast.success('삭제되었습니다.');
          fetchBoardDetail(); // 댓글 목록 새로고침
        } else {
          toast.warn('삭제 실패');
        }
      } catch (error) {
        toast.error('삭제 중 오류:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e7d3] flex flex-col items-center p-6 relative">
      <div className="w-full max-w-5xl flex">
        <InfoSidebar selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />
        <div className="w-3/4 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0] mt-6 ml-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4 border-[#c2c8b0]">
            {/* 게시글 제목 및 버튼 정렬 */}
            <h1 className="text-3xl font-semibold text-[#7c9473]">{board.infoTitle || '로딩 중...'}</h1>
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

          {/* 작성자 및 분류 표시 */}
          <div className="flex justify-between items-center text-[#5f7a60] mt-4 mb-6">
            <div className="text-lg">
              <span className="font-semibold">작성자 :</span> {board.memNick || '알 수 없음'}
              <span className="ml-4 font-semibold">분류 :</span> {board.infoCategory || '없음'}
              <span className="ml-4 font-semibold">작성일 :</span> {board.infoDate || '날짜 없음'}
            </div>
          </div>

          {/* 게시글 내용 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#c2c8b0]">
            <div className="text-lg text-[#5f7a60] whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: board.infoContent || '내용을 불러오는 중입니다.' }} />
          </div>

          {/* 댓글 섹션 */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-[#7c9473] mb-4">댓글</h2>
            <div className="bg-white p-4 rounded-lg shadow-md border border-[#c2c8b0]">
              {comments.map((comment) => (
                <div key={comment.commentId} className="p-3 border-b border-gray-300 flex justify-between items-center">
                  {/* 고유 key 추가 */}
                  <div className="text-gray-500 mb-3 ">
                    <span className="font-semibold">작성자: </span>
                    {comment.memNick}
                    <span className="font-semibold">작성일: {comment.commentDate}</span>
                  </div>
                  {editingCommentId === comment.commentId ? (
                    <div className="flex justify-between items-center">
                      <textarea value={editingCommentContent} onChange={(e) => setEditingCommentContent(e.target.value)} className="flex-grow p-2 rounded-lg h-40" />
                      <button onClick={() => handleUpdateComment(comment.commentId)} className="px-4 py-2 bg-[#7c9473] text-white font-semibold rounded-lg hover:bg-[#93ac90] transition-all shadow-md">
                        수정완료
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex-grow" dangerouslySetInnerHTML={{ __html: comment.commentContent }} />

                      {/* ✅ 로그인한 사용자의 memNo와 작성자의 memNo가 일치할 때만 수정/삭제 버튼 표시 */}
                      {comment.memNo === user.memNo && (
                        <div className="flex space-x-2 mt-2">
                          <button onClick={() => startEditing(comment.commentId, comment.commentContent)} className="px-4 py-2 bg-[#7c9473] text-white font-semibold rounded-lg hover:bg-[#93ac90] transition-all shadow-md">
                            수정
                          </button>
                          <button onClick={() => handleDeleteComment(comment.commentId)} className="px-4 py-2 bg-[#e5d8bf] text-[#5f7a60] font-semibold rounded-lg hover:bg-[#d7c7a8] transition-all shadow-md">
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 댓글 입력창 및 버튼 정렬 */}
            <div className="mt-4">
              {/* 댓글 입력창 */}
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full h-20 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="댓글을 입력하세요..." />

              {/* 댓글 등록 버튼 */}
              <div className="flex justify-end mt-2">
                <button onClick={handleCommentSubmit} className="px-6 py-2 bg-[#7c9473] text-white font-semibold rounded-lg hover:bg-[#93ac90] transition-all shadow-md">
                  답변 등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBoardDetail;
