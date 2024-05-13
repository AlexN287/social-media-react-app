import React, { useState, useRef} from 'react';
import '../../Styles/Components/Common/OptionButton.css'; // Import the CSS file for styling

import useOutsideClick from '../../Hooks/Common/UseOutsideClick';

const OptionsButton = ({ children }) => {
    const [showMenu, setShowMenu] = useState(false);
    const buttonRef = useRef(null);

    // Specifically close menu
    const closeMenu = () => setShowMenu(false);

    // Toggle menu visibility
    const toggleMenu = () => setShowMenu(prev => !prev);

    // Use the modified outside click handler
    useOutsideClick(buttonRef, () => {
        if (showMenu) closeMenu();
    });

    return (
        <div ref={buttonRef} className='options-button-container'>
            <button className="options-button" onClick={toggleMenu} aria-label="More options">
                &#8942; {/* Unicode character for vertical ellipsis */}
            </button>
            {showMenu && (
                <div className="dropdown-menu">
                    {children}
                </div>
            )}
        </div>
    );
};

export default OptionsButton;
