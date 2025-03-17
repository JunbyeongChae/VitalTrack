import React from 'react';

const InfoSidebar = ({ selectedCategory, onSelectCategory }) => {
  const categories = ['전체', '운동정보', '영양정보', '건강관리팁'];

  return (
    <div className="w-1/4 h-screen min-h-[600px] max-h-screen overflow-y-auto bg-[#f2f5eb] p-6 rounded-xl shadow-lg border border-[#c2c8b0] mt-6">
      <h2 className="text-xl font-semibold text-[#7c9473] mb-4">게시물 분류</h2>
      <ul className="space-y-3">
        {categories.map((category, index) => (
          <li
            key={index}
            className={`p-3 text-[#5f7a60] rounded-lg cursor-pointer hover:bg-[#d7e3c7] transition-all 
          ${selectedCategory === category ? 'bg-[#93ac90] text-white font-bold' : ''}`}
            onClick={() => onSelectCategory(category)}>
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfoSidebar;
