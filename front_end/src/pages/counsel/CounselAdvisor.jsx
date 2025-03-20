import React from 'react';
import CounselSidebar from './CounselSidebar';
import 'tailwindcss/tailwind.css';

const CounselAdvisor = () => {
  return (
    <div className="min-h-screen bg-[#e3e7d3] flex flex-col items-center p-6 relative">
      <div className="w-full max-w-5xl flex">
        <CounselSidebar className="w-1/4" />
        <div className="w-3/4 p-6 bg-[#f2f5eb] text-[#5f7a60] rounded-xl shadow-lg border border-[#c2c8b0] mt-6 ml-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4 border-[#c2c8b0]">
            <h1 className="text-2xl font-semibold text-[#7c9473]">상담사 소개</h1>
          </div>
          <div className="flex mt-1 flex-wrap gap-1 pb-2">
            <img src="/images/advisor.png" alt="영양사 면허" className="rounded-lg shadow-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselAdvisor;
