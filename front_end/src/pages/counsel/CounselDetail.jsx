import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boardDetailDB, boardDeleteDB, commentInsertDB, commentUpdateDB } from '../../services/counselLogic';
import { toast } from 'react-toastify';
import Sidebar from './CounselSidebar';

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
  const memNick = user.memNick || '';

  // 게시글 상세 정보 가져오기
  const fetchBoardDetail = useCallback(async () => {
    try {
      const res = await boardDetailDB(counselNo);
      if (res.data && res.data.length > 0) {
        // 0번 인덱스: 게시글
        const boardData = res.data.find((item) => item.counselNo === parseInt(counselNo));
        if (boardData) setBoard(boardData);

        // 1번 인덱스: comments
        const commentIndex = res.data.findIndex((item) => item.comments);
        if (commentIndex !== -1) {
          setComments(res.data[commentIndex].comments);
        } else {
          // 답변이 없을 경우
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
    // 로그인하지 않은 상태라면 등록 불가
    if (!memNo || !memNick) {
      toast.warn('로그인 후 이용 가능합니다.');
      return;
    }
    const formattedComment = newComment.replace(/\n/g, '<br>'); // 줄바꿈을 <br>로 변환

    // DB저장 답변 정보
    const commentData = {
      counselNo: parseInt(counselNo),
      memNo: memNo,
      answerWriter: memNick,
      answerContent: formattedComment
    };

    try {
      const res = await commentInsertDB(commentData);
      if (res.data === 1) {
        toast.success('답변이 등록되었습니다.');
        // 입력 필드 초기화
        setNewComment('');
        // 재조회하여 답변 목록 갱신
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
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
  };

  const handleCommentUpdate = async () => {
    if (!editingCommentContent.trim()) {
      toast.warn('수정 내용을 입력하세요.');
      return;
    }

    const formattedComment = editingCommentContent.replace(/\n/g, '<br>'); // 줄바꿈 적용

    const updatedComment = {
      answerId: editingCommentId,
      answerContent: formattedComment,
      answerWriter: memNick
    };

    try {
      const res = await commentUpdateDB(updatedComment);
      if (res.data === 1) {
        toast.success('댓글이 수정되었습니다.');
        setEditingCommentId(null);
        fetchBoardDetail(); // 댓글 목록 새로고침
      } else {
        toast.error('수정 실패');
      }
    } catch (error) {
      console.error('수정 중 오류:', error);
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
            <h1 className="text-3xl font-bold mb-4">상담내용</h1>
            <hr className="my-2" />
            <div className="max-w-5xl mx-auto p-6 space-y-10">
              {/* 게시글 상세 정보 */}
              <section className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{board.counselTitle}</h1>
                <div className="flex justify-between items-center mb-4 text-gray-500">
                  <p>
                    작성자: <span className="font-semibold">{board.memNick}</span>
                  </p>
                  <p>
                    작성일: <span className="font-semibold">{board.counselDate}</span>
                  </p>
                </div>
                <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: board.counselContent }} />
                <hr className="my-4" />
                <div className="flex justify-end">
                  <button onClick={() => navigate(`/counsel/update/${counselNo}`)} className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    수정
                  </button>
                  <button onClick={handleDelete} className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                    삭제
                  </button>
                </div>
              </section>

              <hr className="border-gray-300" />

              {/* 답변 영역 */}
              <section className="p-6 bg-gray-50 shadow-lg rounded-lg border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">답변</h3>
                {comments.map((comment) => (
                  <div key={comment.commentId} className="p-4 bg-white shadow rounded-lg border border-gray-200 mb-4">
                    {editingCommentId === comment.commentId ? (
                      // 댓글 수정 모드
                      <>
                        <textarea value={editingCommentContent} onChange={(e) => setEditingCommentContent(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                        <button onClick={handleCommentUpdate} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                          수정 완료
                        </button>
                      </>
                    ) : (
                      // 기존 댓글 출력
                      <>
                        <div dangerouslySetInnerHTML={{ __html: comment.commentContent }} />
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <div className="flex space-x-2">
                            <span>작성자: {comment.commentWriter}</span>
                            <span>작성일: {comment.commentDate}</span>
                          </div>
                          <button onClick={() => startEditing(comment.commentId, comment.commentContent)} className="text-blue-500 hover:underline">
                            수정
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </section>

              {/* [추가] 답변 작성 폼 */}
              <div className="mt-4">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">답변 작성</h4>
                <textarea className="w-full h-20 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="답변을 입력하세요..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <div className="flex justify-end mt-2">
                  <button onClick={handleCommentInsert} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    등록
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselDetail;
