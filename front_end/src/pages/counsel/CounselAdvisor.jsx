import React from 'react';
import Sidebar from '../../components/Sidebar';

const CounselAdvisor = () => {
  return (
    <div className="container mx-auto p-4 flex h-screen">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex-grow flex-col">
        <div className="page-header mb-4">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4">상담사 소개</h1>
            <div className="flex items-center">
              <img src="/images/advisor-profile.jpg" alt="영양사 면허" className="rounded-lg shadow-md mr-6 border-2 border-gray-300 w-1/2" />
              <div>
                <h1 className="text-2xl font-semibold">홍길동</h1>
                <p className="mt-5 text-gray-600">영양 상담 전문가</p>
                <p className="mt-5 text-gray-800">
                  영양학과를 졸업하고, <br />
                  다양한 고객을 대상으로 건강한 식습관을 컨설팅해 왔습니다.
                  <br />
                  맞춤형 영양 상담을 통해 건강한 삶을 위한 식습관을 제안합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselAdvisor;
