import React from "react";
import '../../Styles/Components/Auth/InputField.css';

const InputField = ({ type, name, placeholder, value, onChange }) => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="input-field" // Assuming Bootstrap or similar is being used
    />
  );
  
  export default InputField;
  