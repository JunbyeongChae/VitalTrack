import React from 'react';
import { Link } from 'react-router-dom';

const CounselItem = ({ board, page, index, itemsPerPage }) => {
  const rowNumber = (page - 1) * itemsPerPage + index + 1;
  const { counselNo, counselTitle, memNick, counselDate } = board;

  if (!board) {
    return null; // board가 undefined일 경우 렌더링하지 않음
  }

  console.log('상담 데이터:', board); // 데이터 확인용 로그

  return (
    <tr>
      <td className="p-3 border-b border-[#c2c8b0] text-center">{rowNumber}</td>
      <td className="p-3 border-b border-[#c2c8b0] text-left">
        <Link to={`/counsel/${counselNo}?page=${page}`} className="text-blue-500 hover:underline">
          {counselTitle}
        </Link>
      </td>
      <td className="p-3 border-b border-[#c2c8b0] text-center">{memNick}</td>
      <td className="p-3 border-b border-[#c2c8b0] text-center">{counselDate}</td>
    </tr>
  );
};

export default CounselItem;
