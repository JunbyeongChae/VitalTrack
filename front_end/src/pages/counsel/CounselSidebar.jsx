import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const CounselSidebar = () => {
  const location = useLocation();
  const links = [
    { path: '/adivsor', label: '상담사 소개' },
    { path: '/counsel', label: '1:1 상담' }
  ];

  return (
    <div className="w-full md:w-1/4 h-auto md:min-h-[600px] max-h-screen overflow-y-auto bg-[#f2f5eb] p-6 rounded-xl shadow-lg border border-[#c2c8b0] md:mt-0"> {/* 수정 내용: 반응형 너비, 높이, 마진 처리 */}
      <h2 className="text-xl font-semibold text-[#7c9473] mb-4">영양 상담</h2>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li
            key={index}
            className={`p-3 text-[#5f7a60] rounded-lg cursor-pointer hover:bg-[#d7e3c7] transition-all ${
              location.pathname.startsWith(link.path)
                ? 'bg-[#93ac90] text-white font-bold'
                : ''
            }`}
          >
            <Link to={link.path} className="block w-full h-full">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CounselSidebar;
