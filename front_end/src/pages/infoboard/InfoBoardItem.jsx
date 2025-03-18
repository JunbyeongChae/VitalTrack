import React from 'react';
import { Link } from 'react-router-dom';

const InfoBoardItem = ({  board, page, index, itemsPerPage }) => {
  const rowNumber = (page - 1) * itemsPerPage + index + 1;
  if (!board) {
    return null; // board가 undefined일 경우 렌더링하지 않음
  }

  console.log('게시글 데이터:', board); // 데이터 확인용 로그

  return (
    <tr>
      <td className="p-3 border-b border-[#c2c8b0] text-center">{rowNumber}</td>
      <td className="p-3 border-b border-[#c2c8b0] text-left">
        <Link to={`/healthInfo/${board.infoNo}`} className="text-blue-500 hover:underline">
          {board.infoTitle}
        </Link>
      </td>
      <td className="p-3 border-b border-[#c2c8b0] text-center">{board.memNick}</td>
      <td className="p-3 border-b border-[#c2c8b0] text-center">{board.infoCategory}</td>
      <td className="p-3 border-b border-[#c2c8b0] text-center">{board.infoDate}</td>
      <td className="p-3 border-b border-[#c2c8b0] text-center">{board.infoView}</td>
    </tr>
  );
};

export default InfoBoardItem;
