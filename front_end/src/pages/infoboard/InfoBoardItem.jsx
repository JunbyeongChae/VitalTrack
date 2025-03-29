import React from 'react';
import { Link } from 'react-router-dom';

const InfoBoardItem = ({ board}) => {
  if (!board) {
    return null; // board가 undefined일 경우 렌더링하지 않음
  }

  console.log('게시글 데이터:', board); // 데이터 확인용 로그

  const thumbnail = board.infoFile
  ? board.infoFile.startsWith('https://img.youtube.com/')
    ? board.infoFile // 유튜브 썸네일이면 그대로 사용
    : `${process.env.REACT_APP_SPRING_IP}api/infoboard/imageGet?imageName=${board.infoFile}` // 일반 업로드 이미지
  : 'https://www.dummyimage.com/480x320/000/fff'; // 기본 썸네일 경로

  return (
    // ✅ 반응형 카드: aspect-square + flex-grow 구성 유지
    <Link
      to={`/healthInfo/${board.infoNo}`}
      className="w-full aspect-square bg-white rounded-xl overflow-hidden shadow-lg border border-[#c2c8b0] hover:shadow-xl transition-all flex flex-col"
    >
      <img src={thumbnail} alt="썸네일" className="w-full h-1/2 object-cover" />
      {/* ✅ 내부 콘텐츠 영역 반응형 텍스트 처리 */}
      <div className="p-4 flex flex-col justify-between h-1/2 text-[#5f7a60]">
        <h2 className="text-base sm:text-lg font-bold break-words">{board.infoTitle}</h2>
        <p className="text-xs sm:text-sm">작성자 {board.memNick}</p>
        <p className="text-xs sm:text-sm">작성일 {board.infoDate}</p>
        <p className="text-xs sm:text-sm">조회수 {board.infoView} | 카테고리 {board.infoCategory}</p>
      </div>
    </Link>
  );
};

export default InfoBoardItem;
