import React from 'react';
import { BButton, CommentArea, FormDiv } from '../../styles/FormStyles';
import CounselHeader from './CounselHeader';

const CounselDetail = () => {
  return (
    <>
      <FormDiv>
        {/*<CounselHeader board={board} b_no={b_no} page={page} />*/}
        <section>
          <div dangerouslySetInnerHTML={{}}></div>
        </section>
        <hr className="h-0.5" />
        <div>
          <h3>댓글작성</h3>
          <div className="flex">
            <textarea className="w-full resize-none border border-gray-300 rounded-lg p-2.5" />
            <BButton className="h-15 ml-2.5">작성</BButton>
          </div>
        </div>
        <hr className="h-0.5" />
        <div>
          <div className="flex justify-between mb-2.5">
            <div className="flex flex-col text-lg">
              <span>작성일 : {}</span>
              <span>작성자 : {}</span>
            </div>
            <div>
              <BButton>답변</BButton>
              <BButton>수정</BButton>
              <BButton>삭제</BButton>
            </div>
          </div>
          <div>
            <CommentArea/>
          </div>
        </div>
      </FormDiv>
    </>
  );
};

export default CounselDetail;
