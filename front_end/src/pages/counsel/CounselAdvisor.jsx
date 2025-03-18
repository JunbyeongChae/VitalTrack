import React from 'react';
import Sidebar from './CounselSidebar';
import 'tailwindcss/tailwind.css';

const CounselAdvisor = () => {
  return (
    <div className="container mx-auto p-4 flex">
      <div>
        <Sidebar />
      </div>
      <div className='flex-grow flex-col'>
        <div className="page-header mb-4">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4">상담사 소개</h1>
            <hr className="my-2" />
            
            <div className="flex items-center">
              <img src="/images/advisor.png" alt="영양사 면허" className="rounded-lg shadow-md mr-6 border-2 border-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselAdvisor;
