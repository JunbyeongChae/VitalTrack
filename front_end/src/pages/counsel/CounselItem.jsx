import React from 'react';
import { Link } from 'react-router-dom';

const CounselItem = ({ board, page, index, itemsPerPage }) => {
  const rowNumber = (page - 1) * itemsPerPage + index + 1;
  const { counselNo, counselTitle, memNick, counselDate } = board;
  return (
    <tr>
      <td className="text-center">{rowNumber}</td>
      <td>
        <Link to={`/counsel/${counselNo}?page=${page}`} className="text-blue-500 hover:underline">
          {counselTitle}
        </Link>
      </td>
      <td className="text-center">{memNick}</td>
      <td className="text-center">{counselDate}</td>
    </tr>
  );
};

export default CounselItem;
