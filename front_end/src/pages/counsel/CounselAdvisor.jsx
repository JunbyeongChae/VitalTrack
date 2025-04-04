import React from 'react';
import CounselSidebar from './CounselSidebar';
import 'tailwindcss/tailwind.css';

const CounselAdvisor = () => {
  return (
    <div className="min-h-screen bg-[#e3e7d3] flex flex-col items-center p-6 relative">
      <div className="w-full max-w-5xl flex flex-col md:flex-row">
        {' '}
        {/* 수정 내용: 반응형 레이아웃 적용 */}
        <div className="w-full md:w-1/4">
          {' '}
          {/* 수정 내용: 사이드바 반응형 처리 */}
          <CounselSidebar />
        </div>
        <div className="w-full md:w-3/4 mt-6 md:mt-0 md:ml-6 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0]">
          <div className="flex justify-between items-center border-b pb-4 mb-4 border-[#c2c8b0]">
            <h1 className="text-2xl font-semibold text-[#7c9473]">상담사 소개</h1>
          </div>

          {/* ✅ 이미지 정렬 및 크기 수정 */}
          <div className="flex justify-center mt-1 pb-2">
            <img src="/images/advisor.png" alt="영양사 면허" className="rounded-lg shadow-md w-full max-w-4xl mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselAdvisor;
