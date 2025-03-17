import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

const categories = [
  "전체",
  "운동정보",
  "영양정보",
  "건강관리팁",
];

const postsData = [
  { id: 1, title: "홈트레이닝 팁", author: "운동 전문가", date: "2025-02-27", views: 123, content: "이것은 운동정보 관련 게시물입니다.", category: "운동정보" },
  { id: 2, title: "비타민 섭취 가이드", author: "영양사", date: "2025-02-26", views: 98, content: "이것은 영양정보 관련 게시물입니다.", category: "영양정보" },
  { id: 3, title: "스트레스 관리법", author: "심리 상담사", date: "2025-02-25", views: 76, content: "이것은 건강관리팁 관련 게시물입니다.", category: "건강관리팁" }
];

const InfoBoardList = () => {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const navigate = useNavigate();
  
    const filteredPosts = postsData.filter((post) =>
      (selectedCategory === "전체" || post.category === selectedCategory) &&
      post.title.toLowerCase().includes(search.toLowerCase())
    );
  return (
    <div className="min-h-screen bg-[#e3e7d3] flex flex-col items-center p-6 relative">
      <div className="w-full max-w-5xl flex">
        <div className="w-1/4 bg-[#f2f5eb] p-6 rounded-xl shadow-lg border border-[#c2c8b0] mt-6">
          <h2 className="text-xl font-semibold text-[#7c9473] mb-4">게시물 분류</h2>
          <ul className="space-y-3">
            {categories.map((category, index) => (
              <li
                key={index}
                className={`p-3 text-[#5f7a60] rounded-lg cursor-pointer hover:bg-[#d7e3c7] transition-all 
                ${selectedCategory === category ? 'bg-[#93ac90] text-white font-bold' : ''}`}
                onClick={() => setSelectedCategory(category)}>
                {category}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-3/4 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0] mt-6 ml-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4 border-[#c2c8b0]">
            <h1 className="text-2xl font-semibold text-[#7c9473]">건강 관리 게시판</h1>
            <div className="flex space-x-2">
              <input type="text" placeholder="검색어 입력..." className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-[#93ac90] bg-white border-[#a8b18f] text-[#5f7a60]" value={search} onChange={(e) => setSearch(e.target.value)} />
              <button onClick={() => navigate('/healthInfo/write')} className="bg-[#93ac90] text-white px-4 py-2 rounded-lg hover:bg-[#7c9473] transition-all shadow-md">
                글쓰기
              </button>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="bg-[#d7e3c7] text-[#5f7a60]">
              <tr>
                <th className="p-3 text-center border-b border-[#c2c8b0]">번호</th>
                <th className="p-3 text-center border-b border-[#c2c8b0]">제목</th>
                <th className="p-3 text-center border-b border-[#c2c8b0]">카테고리</th>
                <th className="p-3 text-center border-b border-[#c2c8b0]">작성자</th>
                <th className="p-3 text-center border-b border-[#c2c8b0]">날짜</th>
                <th className="p-3 text-center border-b border-[#c2c8b0]">조회수</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="border-b border-[#c2c8b0] hover:bg-[#d7e3c7] cursor-pointer transition-all" onClick={() => navigate(`/healthInfo/${post.id}`)}>
                    <td className="p-3 text-center">{post.id}</td>
                    <td className="p-3 text-center">{post.title}</td>
                    <td className="p-3 text-center">{post.category}</td>
                    <td className="p-3 text-center">{post.author}</td>
                    <td className="p-3 text-center">{post.date}</td>
                    <td className="p-3 text-center">{post.views}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-[#7c9473]">
                    📭 해당 카테고리에 게시물이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InfoBoardList;
