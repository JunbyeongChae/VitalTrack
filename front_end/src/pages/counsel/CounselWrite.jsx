import React from 'react';
import { BButton, ContainerDiv, FormDiv, HeaderDiv } from '../../components/style/FormStyles';
import QuillEditor from './QuillEditor';

const CounselWrite = () => {
  return (
    <>
      <ContainerDiv>
        <HeaderDiv>
          <h3>게시글 작성</h3>
        </HeaderDiv>
        <FormDiv>
          <div style={{ width: '100%', maxWidth: '2000px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <h2>제목</h2>
              <div style={{ display: 'flex' }}>
                <BButton style={{ marginLeft: '10px' }} >
                  글쓰기
                </BButton>
              </div>
            </div>
            <input
              id="dataset-title"
              type="text"
              maxLength="50"
              placeholder="제목을 입력하세요."
              style={{ width: '100%', height: '40px', border: '1px solid lightGray' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', marginTop: '5px' }}>
              <h2>작성자</h2>
            </div>
            <input
              id="dataset-writer"
              type="text"
              maxLength="20"
              placeholder="작성자를 입력하세요."
              style={{ width: '200px', height: '40px', border: '1px solid lightGray' }}
            />
            <hr style={{ margin: '10px 0px 10px 0px' }} />
            <h3>상세내용</h3>
            <QuillEditor /* value={content} handleContent={handleContent} quillRef={quillRef} */ />
          </div>
        </FormDiv>
      </ContainerDiv>
    </>
  );
};

export default CounselWrite;
