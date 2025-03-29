import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const CounselSidebar = () => {
  const location = useLocation();
  const links = [
    { path: '/adivsor', label: '상담사 소개' },
    { path: '/counsel', label: '1:1 상담' }
  ];

  return (
    <div className="w-full md:w-1/4 h-auto md:min-h-[600px] md:max-h-screen md:overflow-y-auto bg-[#f2f5eb] p-6 rounded-xl shadow-lg border border-[#c2c8b0] mt-0 md:mt-0">
      <h2 className="text-xl font-semibold text-[#7c9473] mb-4">영양 상담</h2>
      <ul className="space-y-3">
      {links.map((link, index) => (
          <li key={index}>
            {/* ✅ 수정: 스타일을 li가 아닌 Link에 직접 적용 */}
            <Link
              to={link.path}
              className={`block p-3 text-[#5f7a60] rounded-lg cursor-pointer hover:bg-[#d7e3c7] transition-all 
                ${location.pathname.startsWith(link.path) ? 'bg-[#93ac90] text-white font-bold' : ''}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CounselSidebar;
