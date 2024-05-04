import React from "react";
import '../../Styles/Components/Auth/FileInputField.css';

const FileInputField = ({ name, accept, onChange }) => (
    <input
      type="file"
      name={name}
      accept={accept}
      onChange={onChange}
      className="file-input-field"
    />
  );
  
  export default FileInputField;
  