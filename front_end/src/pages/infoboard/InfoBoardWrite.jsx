import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

const InfoBoardWrite = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.length < 5) {
      alert("제목은 최소 5자 이상 입력해주세요.");
      return;
    }

    alert("게시물이 작성되었습니다!");
    navigate("/healthInfo");
  };

  const handleCancel = () => {
    if (window.confirm("작성 중인 내용을 취소하시겠습니까?")) {
      navigate("/healthInfo");
    }
  };

  const handleGoToCommunity = () => {
    if (window.confirm("게시물 목록으로 이동 시 작성된 내용은 저장되지 않습니다.")) {
      navigate("/healthInfo");
    }
  };
  return (
    <div className="min-h-screen bg-[#e3e7d3] flex justify-center items-center p-6 relative">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-2xl border border-[#c2c8b0]">
        <h1 className="text-3xl font-semibold text-center text-[#7c9473] mb-6">👷‍♂️ 게시물 작성</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 입력 */}
          <div>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 text-lg border border-[#a8b18f] bg-[#f2f5eb] rounded-xl focus:ring-2 focus:ring-[#93ac90] focus:outline-none transition-shadow shadow-sm"
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          {/* 내용 입력 */}
          <div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 text-lg border border-[#a8b18f] bg-[#f2f5eb] rounded-xl focus:ring-2 focus:ring-[#93ac90] focus:outline-none transition-shadow shadow-sm"
              placeholder="내용을 입력하세요"
              rows="6"
            ></textarea>
          </div>

          {/* 제출 & 취소 버튼 */}
          <div className="flex flex-col space-y-3">
            <button type="submit" className="w-full py-3 bg-[#93ac90] text-white font-semibold rounded-xl hover:bg-[#7c9473] transition-all shadow-md">
              게시물 작성
            </button>
            <button 
              type="button" 
              onClick={handleCancel} 
              className="w-full py-3 bg-[#e5d8bf] text-[#5f7a60] font-semibold rounded-xl hover:bg-[#d7c7a8] transition-all shadow-md"
            >
              작성 취소
            </button>
          </div>
        </form>
      </div>
      {/* 게시물 목록 버튼 */}
      <button 
        onClick={handleGoToCommunity} 
        className="absolute top-6 right-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-all shadow-md"
      >
        게시물 목록
      </button>
    </div>
  );
};

export default InfoBoardWrite