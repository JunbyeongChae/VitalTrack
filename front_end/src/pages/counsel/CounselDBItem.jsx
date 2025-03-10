import React from 'react';
import { Link } from 'react-router';

const CounselDBItem = (props) => {
  const { counsel_no, counsel_title, mem_nick, counsel_date } = props.board;
  //console.log(n_title)
  console.log(props.page);
  return (
    <>
      <tr>
        <td>{counsel_no}</td>
        <td>
          <Link to={`/counsel/${counsel_no}?page=${props.page}`} className="btn btn-primary">
            {counsel_title}
          </Link>
        </td>
        <td>{mem_nick}</td>
        <td>{counsel_date}</td>
      </tr>
    </>
  );
};

export default CounselDBItem;
