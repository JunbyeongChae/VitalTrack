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
      <td className="p-3 border-b border-[#c2c8b0] text-left max-w-[160px] sm:max-w-none truncate"> {/* 수정 내용: 모바일에서 글자 넘침 방지 */}
        <Link
          to={`/counsel/${counselNo}?page=${page}`}
          className="text-blue-500 hover:underline break-words"
        >
          {counselTitle}
        </Link>
      </td>
      <td className="p-3 border-b border-[#c2c8b0] text-center text-sm sm:text-base"> {/* 수정 내용: 글씨 크기 반응형 조정 */}
        {memNick}
      </td>
      <td className="p-3 border-b border-[#c2c8b0] text-center text-sm sm:text-base"> {/* 수정 내용: 글씨 크기 반응형 조정 */}
        {counselDate}
      </td>
    </tr>
  );
};

export default CounselItem;
