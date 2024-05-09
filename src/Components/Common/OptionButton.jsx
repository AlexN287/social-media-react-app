import React from 'react';
import '../../Styles/Components/Common/OptionButton.css'; // Import the CSS file for styling

const OptionsButton = ({ onClick }) => {
    return (
        <button className="options-button" onClick={onClick} aria-label="More options">
            &#8942; {/* Unicode character for vertical ellipsis */}
        </button>
    );
};

export default OptionsButton;
