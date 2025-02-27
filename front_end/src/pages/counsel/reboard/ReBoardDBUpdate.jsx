import React, { useCallback, useEffect, useRef, useState } from 'react';
import Header from '../include/Header';
import { BButton, ContainerDiv, FormDiv, HeaderDiv } from '../../styles/FormStyles';
import QuillEditor from './QuillEditor';
import Footer from '../include/Footer';
import { useNavigate, useParams } from 'react-router';
import { boardDetailDB, boardUpdateDB } from '../../service/dbLogic';
//-> http://localhost:3000/reboard/update/:b_no
const ReBoardDBUpdate = () => {
  const navigate = useNavigate();
  //쿼리 스트링이 아니라 hash값으로 받아오기
  const { b_no } = useParams();
  console.log(b_no); //사용자가 선택한 글 번호
  const [title, setTitle] = useState(''); // 사용자가 수정하는 제목 담기
  const [content, setContent] = useState(''); //사용자가 수정하는 내용 담기
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('email');
  });
  const quillRef = useRef();

  useEffect(() => {
    //async와 await 페어로 작성할것.- 비동기  처리 -> 자바스크립트는 기본적으로 동기처리
    //8000번 서버에서 처리하기 까지 지연이 발생함. - 기다리는 동안 다른 일을 해줘
    //새글을 작성할 때는 오라클 서버를 경유할 필요가 없지만 수정할 때는 기본 정보를 보여줘야 하므로
    //오라클 서버를 먼저 경유하고 조회된 결과를 화면에 먼저 보여주자.
    const asyncDB = async () => {
      const res = await boardDetailDB(b_no); //select-[{},{},{}]
      //res.data[0]: 상세보기에 대한 정보가 담겨 있고
      //res.data[1]:현재 글에 대한 댓글이 있을 때만 존재한다.
      console.log(res.data[0]);
      //console.log(res.data[1])댓글이 존재하는 경우에만 확인이 가능하다.
      console.log(res.data[0].B_TITLE);
      setTitle(res.data[0].B_TITLE);
      setContent(res.data[0].B_CONTENT);
      setEmail(res.data[0].MEM_NAME);
    };
    asyncDB(); //화면이 열리기 전에 오라클 서버 경유하기 위해
  },[b_no,setTitle,setContent,setEmail]); //의존성 배열에 값이 변할 때 마다 useEffect안에 선언된 화살표 함수가 실행됨.
  //함수를 메모이제이션 처리할 때 useCallback훅을 사용한다.
  //BoardDBUpdate는 함수이지만 return에서 멀티 엘리먼트를 갖고 있어서 화면 출력함.
  //이 함수는 props나 state가 변하면 새로 렌더링을 한다.
  //새로 렌더링이 일어날 때 마다 함수가 매번 새로 만들어진다. - 비효율적
  //메모이제이션 처리한다.
  //QuillEditor.jsx - 수정되는 부분도 ReBoardDBUpdate의 자손 객체 이므로
  //부모가 변하면 자손도 새로 렌더링이 일어난다.
  //언제(어떤 이벤트가 발동) 호출되는 함수인가? -
  const handleTitle = useCallback(
    (value) => {
      //이벤트 소스가 감지한 값을 useState담기
      setTitle(value); //setter함수 호출이 되면 title변수에 값이 재정의 됨. - 새로 렌더링이 일어남
      //새로 렌더링이 일어날 때 마다 handleTitle함수가 새로 생성됨. - 그러지 않도록 하기 위해서
      //useCallback씌운다.
    },
    [setTitle]
  ); //의존성 배열이 빈깡통이면 최초 한번만 호출이 된다.
  const handleEmail = useCallback(
    (value) => {
      setEmail(value);
    },
    [setEmail]
  );
  const handleContent = useCallback(
    (value) => {
      setContent(value);
    },
    [setContent]
  );
  const boardUpdate = async () => {
    //실제 수정버튼이 눌렸을 때 호출
    const board = {
      b_no: b_no, //조건절에 들어가는 고정값 -  b_no가 같은 값에 대해서만 수정하기
      b_title: title, //키와 값이 다른 경우는 생략이 불가함.
      email: email,
      b_content: content
    };
    console.log('Updating board:', board); // 디버깅 로그 추가
    const res = await boardUpdateDB(board);
    console.log('Update response:', res); // 디버깅 로그 추가
    if (res.data === 1) {
      //수정이 성공한 겨우
      //수정이 성공하면 목록페이지를 출력한다.
      //목록 페이지로 이동하는 URL요청에서 쿼리스트링으로 붙은 page=1값은
      //목록 페이지 처리할 때 현재 내가 있었던 위치를 기억하는 값이어야 한다.
      //후처리가 필요하다.
      navigate('/reboard?page=1');
    } else {
      //수정이 실패한 경우
      console.log('수정 실패하였습니다.');
    }
  }; //end of boardUpdate
  return (
    <>
      <Header />
      <ContainerDiv>
        <HeaderDiv>
          <h3>게시글 수정</h3>
        </HeaderDiv>
        <FormDiv>
          <div style={{ width: '100%', maxWidth: '2000px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <h2>제목</h2>
              <div style={{ display: 'flex' }}>
                <BButton style={{ marginLeft: '10px' }} onClick={boardUpdate}>
                  글수정
                </BButton>
              </div>
            </div>
            <input
              id="dataset-title"
              type="text"
              maxLength="50"
              placeholder="제목을 입력하세요."
              value={title}
              style={{ width: '100%', height: '40px', border: '1px solid lightGray' }}
              onChange={(e) => {
                handleTitle(e.target.value);
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', marginTop: '5px' }}>
              <h2>작성자</h2>
            </div>
            <input
              id="dataset-writer"
              type="text"
              maxLength="20"
              placeholder="작성자를 입력하세요."
              value={email}
              style={{ width: '200px', height: '40px', border: '1px solid lightGray' }}
              onChange={(e) => {
                handleEmail(e.target.value);
              }}
            />
            <hr style={{ margin: '10px 0px 10px 0px' }} />
            <h3>상세내용</h3>
            <QuillEditor value={content} handleContent={handleContent} quillRef={quillRef} />
          </div>
        </FormDiv>
      </ContainerDiv>
      <Footer />
    </>
  );
};

export default ReBoardDBUpdate;
