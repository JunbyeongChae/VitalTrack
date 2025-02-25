import React from 'react';

const CounselPage = () => {
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="page-header mb-4">
          <h1 className="text-2xl font-bold">영양상담 게시판</h1>
          <hr className="my-2" />
        </div>
        <div className="flex mb-4">
          <div className="w-1/4 pr-2">
            <select className="form-select w-full p-2 border border-gray-300 rounded" id="gubun">
              <option value="">분류선택</option>
              <option value="counsel_title">제목</option>
              <option value="counsel_content">내용</option>
            </select>
          </div>
          <div className="w-1/2 px-2">
            <input type="text" className="form-control w-full p-2 border border-gray-300 rounded" placeholder="검색어를 입력하세요" id="keyword" />
          </div>
          <div className="w-1/4 pl-2">
            <button type="button" className="btn btn-danger w-full p-2 bg-gray-600 text-white rounded">
              검색
            </button>
          </div>
        </div>

        <table className="table-auto w-full mb-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">분류</th>
              <th className="border px-4 py-2">제목</th>
              <th className="border px-4 py-2">작성자</th>
            </tr>
          </thead>
        </table>

        <div className="d-flex justify-content-center mb-4">
          <table className="table-auto w-full mb-4">
            <tbody>
              <tr>
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">영양상담 예시 제목1</td>
                <td className="border px-4 py-2">홍길동</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">2</td>
                <td className="border px-4 py-2">영양상담 예시 제목2</td>
                <td className="border px-4 py-2">홍길동</td>
              </tr>
            </tbody>
          </table>
          <div className="d-flex justify-content-center">
            {/* <Pagination></Pagination> */}
          </div>
        </div>

        <hr className="my-2" />
        <div className="list-footer flex justify-center space-x-2">
          <button className="btn btn-warning p-2 bg-yellow-500 text-white rounded">전체조회</button>
          <button className="btn btn-success p-2 bg-green-500 text-white rounded">상담글쓰기</button>
        </div>
      </div>
    </>
  );
};

export default CounselPage;
