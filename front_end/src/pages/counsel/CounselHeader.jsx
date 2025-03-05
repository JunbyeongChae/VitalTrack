import React from 'react';
import { BButton } from '../../components/style/FormStyles';

const CounselHeader = () => {
  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex justify-between">
          <div className="overflow-auto">
            <span className="mb-4 text-2xl block">{}</span>
          </div>
          <div className="flex justify-end">
            <BButton className="mx-2">
              수정
            </BButton>
            <BButton className="mx-2">
              삭제
            </BButton>
            <BButton className="mx-2">
              목록
            </BButton>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex flex-col">
            <span>작성자 : {}</span>
            <span>작성일 : {}</span>
          </div>
          <div className="flex flex-col mr-2.5">
            <div className="flex">
              <span className="mr-1.5">조회수 :</span>
              <div className="flex justify-end w-7.5">{}</div>
            </div>
          </div>
        </div>
      </div>
      <hr className="h-0.5" />
    </>
  );
};

export default CounselHeader;
