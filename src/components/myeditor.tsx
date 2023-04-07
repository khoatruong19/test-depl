/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", ImageResize);

interface IProps{
  data: string
  setData: (value: string) => void
}

const MyEditor = ({data, setData}: IProps) => {
  const quillRef = React.useRef(null);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ size: [] }],
        [{ font: [] }],
        [{ align: ["right", "center", "justify"] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ color: ["red", "#785412"] }],
        [{ background: ["red", "#785412"] }],
      ],
      handlers: {
        image:  () => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();
          input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'uploadTaskly');
            
            const data = await fetch(process.env.IMAGE_UPLOAD_URL as string, {
              method: 'POST',
              body: formData,
            }).then((res) => res.json());
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            quill.editor.insertEmbed(
              range.index,
              "image",
              data.secure_url
            );
          };
        },
      },
    },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
   
  }), [])

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font",
  ];

  const handleProcedureContentChange = (content: string) => {
    setData(content);
  };

  return (
    <ReactQuill
    ref={quillRef}
      theme="snow"
      modules={modules}
      formats={formats}
      value={data}
      onChange={handleProcedureContentChange}
    />
  );
};

export default MyEditor;
