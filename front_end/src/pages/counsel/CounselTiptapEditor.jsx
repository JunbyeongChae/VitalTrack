import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadImageDB } from '../../services/counselLogic';
import '../../styles/TiptapEditor.css';
import { toast } from 'react-toastify';

// 폰트 사이즈 확장
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }
          return { style: `font-size: ${attributes.fontSize}` };
        }
      }
    };
  }
});

const CounselTiptapEditor = ({ value, handleContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      FontSize,
      Image.configure({
        inline: false,
        allowBase64: true
      }),
      Placeholder.configure({
        placeholder: '여기에 내용을 입력하세요...'
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      handleContent(editor.getHTML());
    }
  });

  // value(부모 state) 변경 시 Tiptap도 업데이트
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // 폰트 사이즈 변경
  const setFontSize = (size) => {
    editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
  };

  // 이미지 업로드
  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await uploadImageDB(formData);
        if (res.data) {
          const url = `${process.env.REACT_APP_SPRING_IP}api/counsel/imageGet?imageName=${res.data}`;
          editor.chain().focus().setImage({ src: url }).run();
        } else {
          toast.warn('이미지 업로드 실패');
        }
      } catch (error) {
        toast.error('이미지 업로드 중 오류:' + error);
        console.log(error);
      }
    };
    input.click();
  };

  return (
    <div>
      {/* 툴바 */}
      <div className="flex flex-wrap space-x-2 mb-4">
        <select onChange={(e) => setFontSize(e.target.value)} title="폰트 크기 조절" className="font-size-select">
          <option value="">크기 선택</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="24px">24px</option>
          <option value="32px">32px</option>
        </select>

        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'btn-active' : 'btn'} title="굵게">
          <FontAwesomeIcon icon={faBold} />
        </button>

        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'btn-active' : 'btn'} title="기울임">
          <FontAwesomeIcon icon={faItalic} />
        </button>

        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'btn-active' : 'btn'} title="밑줄">
          <FontAwesomeIcon icon={faUnderline} />
        </button>

        <button onClick={addImage} className="btn" title="이미지 추가">
          <FontAwesomeIcon icon={faImage} />
        </button>
      </div>

      {/* 에디터 */}
      <div onClick={() => editor?.commands.focus()} className="editor-wrapper">
        <EditorContent editor={editor} className="editor-container" />
      </div>
    </div>
  );
};

export default CounselTiptapEditor;
