import React, { useCallback, useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import ReactQuill from 'react-quill';
import { uploadImageDB } from '../../services/dbLogic';

const QuillEditor = forwardRef(({ value, handleContent }, ref) => {
  const quillRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current
  }));

  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current.getEditor()
  }));
  const imageHandler = useCallback(() => {
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
        const formData = new FormData();
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
        const url = `${process.env.REACT_APP_SPRING_IP}api/counsel/imageGet?imageName=${res.data}`;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        if (!range) {
          alert('에디터에 포커스가 필요합니다.');
          return;
        }
        editor.insertEmbed(range.index, 'image', url);
      } catch (error) {
        console.error('이미지 업로드 중 오류 발생:', error);
        alert('이미지 업로드 중 오류가 발생하였습니다.');
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [[{ header: [1, 2, 3, false] }], ['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'image']],
        handlers: {
          image: imageHandler
        }
      }
    }),
    [imageHandler]
  );

  const formats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link', 'image'];

  return (
    <div style={{ height: '550px', display: 'flex', justifyContent: 'center', padding: '0px' }}>
      <ReactQuill ref={quillRef} style={{ height: '470px', width: '100%' }} theme="snow" modules={modules} formats={formats} value={value} onChange={handleContent} />
    </div>
  );
});

export default QuillEditor;
