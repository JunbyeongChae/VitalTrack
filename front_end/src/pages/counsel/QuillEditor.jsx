import React, { useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';
import { uploadImageDB } from '../../service/dbLogic';

const QuillEditor = ({ value, handleContent, quillRef }) => {
  const imageHandler = useCallback(() => {
    const formData = new FormData();
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.setAttribute('name', 'image');
    input.click();
    input.onchange = async () => {
      try {
        const file = input.files[0];
        if (!file) {
          alert('파일이 선택되지 않았습니다.');
          return;
        }
        const fileType = file.name.split('.').pop().toUpperCase();
        if (!['JPG', 'PNG', 'JPEG'].includes(fileType)) {
          alert('jpg, png, jpeg 형식만 지원합니다.');
          return;
        }
        formData.append('image', file);
        const res = await uploadImageDB(formData);
        if (!res.data) {
          alert('이미지 업로드에 실패하였습니다.');
          return;
        }
        const url = `${process.env.REACT_APP_SPRING_IP}api/board/imageGet?imageName=${res.data}`;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection().index;
        if (typeof range !== 'number') {
          alert('에디터에 포커스가 필요합니다.');
          return;
        }
        quill.setSelection(range, 1);
        quill.clipboard.dangerouslyPasteHTML(range, `<img src=${url} style="width: 100%; height: auto;" alt="image" />`);
      } catch (error) {
        console.error('이미지 업로드 중 오류 발생:', error);
        alert('이미지 업로드 중 오류가 발생하였습니다.');
      }
    };
  }, [quillRef]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [[{ header: [1, 2, 3, 4, 5, 6, false] }, { color: [] }, { align: [] }, { background: [] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'], [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }], ['clean'], ['link', 'image']],
        handlers: {
          image: imageHandler
        }
      }
    }),
    [imageHandler]
  );

  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'align', 'color', 'background'];

  return (
    <div style={{ height: '550px', display: 'flex', justifyContent: 'center', padding: '0px' }}>
      <ReactQuill
        ref={quillRef}
        style={{ height: '470px', width: '100%' }}
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={(content, delta, source, editor) => {
          handleContent(editor.getHTML());
        }}
      />
    </div>
  );
};

export default QuillEditor;
