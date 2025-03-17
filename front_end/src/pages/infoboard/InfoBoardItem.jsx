import React from 'react';
import { Link } from 'react-router-dom';

const InfoBoardItem = ({ board, page, index, itemsPerPage }) => {
  const rowNumber = (page - 1) * itemsPerPage + index + 1;
  const { infoNo, infoTitle, memNick, infoDate } = board;
  return (
    <tr>
      <td className="text-center">{rowNumber}</td>
      <td>
        <Link to={`/info/${infoNo}?page=${page}`} className="text-blue-500 hover:underline">
          {infoTitle}
        </Link>
      </td>
      <td className="text-center">{memNick}</td>
      <td className="text-center">{infoDate}</td>
    </tr>
  );
};

export default InfoBoardItem