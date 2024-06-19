import React, {useState} from "react";
import '../../Styles/Components/Auth/FileInputField.css';

const FileInputField = ({ name, accept, onChange }) => {
  const [fileName, setFileName] = useState('');

  const handleClick = () => {
      document.getElementById(name).click();
  };

  const handleChange = (event) => {
      const file = event.target.files[0];
      if (file) {
          setFileName(file.name);
      } else {
          setFileName('');
      }
      onChange(event);
  };

  return (
      <div className="file-input-container">
          <input
              type="file"
              name={name}
              id={name}
              accept={accept}
              onChange={handleChange}
              className="file-input-field"
          />
          <button type="button" onClick={handleClick} className="custom-file-input-button">
              Choose File
          </button>
          {fileName && <span className="file-name">{fileName}</span>}
      </div>
  );
};

export default FileInputField;