import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boardDetailDB, boardDeleteDB, commentInsertDB, commentUpdateDB, commentDeleteDB } from '../../services/counselLogic';
import { toast } from 'react-toastify';
import CounselSidebar from './CounselSidebar';

const CounselDetail = () => {
  const { counselNo } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState({});
  const [comments, setComments] = useState([]);

  // 답변작성 관련 상태
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  // 로그인정보 가져오기
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const memNo = user.memNo || '';

  // 답변 목록 가져오기
  const fetchBoardDetail = useCallback(async () => {
    try {
      const res = await boardDetailDB(counselNo);
      if (res.data && res.data.length > 0) {
        const boardData = res.data.find((item) => item.counselNo === parseInt(counselNo));
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
  }, [counselNo]);

  useEffect(() => {
    fetchBoardDetail();
  }, [counselNo, fetchBoardDetail]);

  //게시글 삭제
  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const res = await boardDeleteDB(counselNo);
        if (res.data === 1) {
          toast.success('삭제되었습니다.');
          navigate('/counsel?page=1');
        } else {
          toast.warn('삭제 실패');
        }
      } catch (error) {
        toast.error('삭제 중 오류:', error);
      }
    }
  };

  // 답변 작성
  const handleCommentInsert = async () => {
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
      counselNo: parseInt(counselNo),
      memNo: memNo,
      answerContent: formattedComment
    };

    try {
      const res = await commentInsertDB(commentData);
      if (res.data === 1) {
        toast.success('답변이 등록되었습니다.');
        setNewComment('');
        fetchBoardDetail();
      } else {
        toast.warn('답변 등록에 실패했습니다.');
      }
    } catch (error) {
      toast.error('답변 등록 중 오류 발생.');
    }
  };

  // 답변 수정
  const startEditing = (commentId, content) => {
    // HTML 태그 제거 및 줄바꿈 처리
    const plainTextContent = content.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '');
    setEditingCommentId(commentId);
    setEditingCommentContent(plainTextContent);
  };

  const handleCommentUpdate = async () => {
    if (!editingCommentContent.trim()) {
      toast.warn('수정 내용을 입력하세요.');
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
      const res = await commentUpdateDB(updatedComment);
      if (res.status === 200) {
        toast.success('댓글이 수정되었습니다.');
        setEditingCommentId(null);
        fetchBoardDetail();
      } else {
        toast.error(res.data || '수정 권한이 없습니다.');
      }
    } catch (error) {
      toast.error('댓글 수정 중 오류 발생.');
    }
  };

  // 답변 삭제
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const res = await commentDeleteDB(commentId);
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
        <CounselSidebar className="w-1/4" />
        <div className="w-3/4 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0] mt-6 ml-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4 border-[#c2c8b0]">
            {/* 게시글 제목 및 버튼 정렬 */}
            <h1 className="text-3xl font-semibold text-[#7c9473] pb-4">{board.counselTitle || '로딩 중...'}</h1>
            <div className="flex space-x-2">
              <button onClick={() => navigate('/counsel')} className="px-6 py-2 bg-[#ACA7AF] text-white font-semibold rounded-lg hover:bg-[#A190AB] transition-all shadow-md">
                목록
              </button>
              <button onClick={() => navigate(`/counsel/update/${counselNo}`)} className="px-6 py-2 bg-[#7c9473] text-white font-semibold rounded-lg hover:bg-[#93ac90] transition-all shadow-md">
                수정
              </button>
              <button onClick={handleDelete} className="px-6 py-2 bg-[#e5d8bf] text-[#5f7a60] font-semibold rounded-lg hover:bg-[#d7c7a8] transition-all shadow-md">
                삭제
              </button>
            </div>
          </div>

          {/* 작성자 및 날짜 표시 */}
          <div className="flex justify-between items-center text-[#5f7a60] mt-4 mb-6">
            <div className="text-lg">
              <span className="font-semibold">작성자 :</span> {board.memNick || '알 수 없음'}
              <span className="ml-4 font-semibold">작성일 :</span> {board.counselDate || '날짜 없음'}
            </div>
          </div>

          {/* 게시글 내용 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#c2c8b0]">
            <div className="text-lg text-[#5f7a60] whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: board.counselContent || '내용을 불러오는 중입니다.' }} />
          </div>

          {/* 댓글 섹션 */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-[#7c9473] mb-4">답변</h2>
            <div className="bg-white p-4 rounded-lg shadow-md border border-[#c2c8b0]">
              {comments.map((comment) => (
                <div key={comment.answerId} className="p-3 border-b border-gray-300">
                  {/* 작성자 및 작성일 정보 */}
                  <div className="text-gray-500 mb-2">
                    <span className="font-semibold">작성자 : </span>
                    {comment.memNick}
                    <span className="font-semibold"> | </span>
                    <span className="font-semibold">작성일 : </span>
                    {comment.commentDate}
                  </div>
                  {editingCommentId === comment.answerId ? (
                    <div className="flex flex-col">
                      <textarea value={editingCommentContent} onChange={(e) => setEditingCommentContent(e.target.value)} className="w-full p-2 rounded-lg h-40" />
                      <button onClick={handleCommentUpdate} className="mt-2 px-4 py-2 bg-[#7c9473] text-white font-semibold rounded-lg hover:bg-[#93ac90] transition-all shadow-md">
                        수정완료
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* 답변 내용 */}
                      <div className="mb-2 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: comment.answerContent }} />
                      {/* 수정/삭제 버튼 */}
                      {comment.memNo === user.memNo && (
                        <div className="flex space-x-2">
                          <button onClick={() => startEditing(comment.answerId, comment.answerContent)} className="px-4 py-2 bg-[#7c9473] text-white font-semibold rounded-lg hover:bg-[#93ac90] transition-all shadow-md">
                            수정
                          </button>
                          <button onClick={() => handleDeleteComment(comment.answerId)} className="px-4 py-2 bg-[#e5d8bf] text-[#5f7a60] font-semibold rounded-lg hover:bg-[#d7c7a8] transition-all shadow-md">
                            삭제
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* 댓글 입력창 및 버튼 정렬 */}
            <div className="mt-4">
              <h4 className="text-2xl font-semibold text-[#7c9473] mb-4">답변 작성</h4>
              <textarea className="w-full h-20 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="답변을 입력하세요..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />

              {/* 댓글 등록 버튼 */}
              <div className="flex justify-end mt-2">
                <button onClick={handleCommentInsert} className="px-6 py-2 bg-[#7c9473] text-white font-semibold rounded-lg hover:bg-[#93ac90] transition-all shadow-md">
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

export default CounselDetail;
