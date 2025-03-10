import React, { useCallback, useRef, useState } from 'react';
import { BButton, ContainerDiv, FormDiv, HeaderDiv } from '../../styles/FormStyles';
import { useNavigate } from 'react-router-dom';
import { boardInsertDB } from '../../services/dbLogic';
import QuillEditor from './QuillEditor';

const CounselDBWrite = () => {
  const navigate = useNavigate();
  const quillRef = useRef();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [memNick, setMemNick] = useState(() => {
    return localStorage.getItem('memNick') || '';
  });

  const handleTitle = useCallback((e) => setTitle(e), []);
  const handleContent = useCallback((e) => setContent(e), []);
  const handleMemNick = useCallback((e) => setMemNick(e), []);

  //글쓰기 요청시 호출될 함수 구현
  const boardInsert = async () => {
    if (!title || !content) {
      alert('제목과 내용을 모두 입력하세요.');
      return;
    }
    const board = {
      counselTitle: title,
      memNick: memNick,
      counselContent: content
    };

    const res = await boardInsertDB(board);
    if (res.data) {
      navigate('/counsel?page=1'); // 정상적으로 이동
    } else {
      alert('글쓰기 실패');
    }
  }; //end of boardInsert
  return (
    <ContainerDiv>
      <HeaderDiv>
        <h3>게시글 작성</h3>
      </HeaderDiv>
      <FormDiv>
        <div style={{ width: '100%', maxWidth: '2000px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <h2>제목</h2>
            <div style={{ display: 'flex' }}>
              <BButton style={{ marginLeft: '10px' }} onClick={boardInsert}>
                글쓰기
              </BButton>
            </div>
          </div>
          <input id="dataset-title" type="text" maxLength="50" placeholder="제목을 입력하세요." style={{ width: '100%', height: '40px', border: '1px solid lightGray' }} onChange={(e) => handleTitle(e.target.value)} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', marginTop: '5px' }}>
            <h2>작성자</h2>
          </div>
          <input id="dataset-writer" type="text" maxLength="20" placeholder="작성자를 입력하세요." style={{ width: '200px', height: '40px', border: '1px solid lightGray' }} value={memNick} onChange={(e) => handleMemNick(e.target.value)} />
          <hr style={{ margin: '10px 0px 10px 0px' }} />
          <h3>상세내용</h3>
          <QuillEditor ref={quillRef} value={content} handleContent={handleContent} />
        </div>
      </FormDiv>
    </ContainerDiv>
  );
};

export default CounselDBWrite;
