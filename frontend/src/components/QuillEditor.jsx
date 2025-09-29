import ReactQuill from "react-quill-new";

const QuillEditor = ({ value, onChange }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      className="h-53"
    />
  );
};

export default QuillEditor;
