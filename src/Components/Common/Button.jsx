import React from 'react';
import '../../Styles/Components/Common/Button.css';

const Button = ({ color, children, onClick }) => {
  const className = `button ${color === 'green' ? 'button-green' : 'button-red'}`;

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
