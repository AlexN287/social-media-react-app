import React, { useRef, useEffect } from 'react';
import '../../Styles/Components/Posts/AutoResizingInput.css';

const AutoResizingTextarea = ({ text, onChange, maxHeight = 200 }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height to recalculate
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`; // Set height based on scroll height, capped by maxHeight
        }
    }, [text, maxHeight]);

    return (
        <textarea
            ref={textareaRef}
            className="auto-resizing-textarea" // Use the class from your CSS
            value={text}
            onChange={onChange}
        />
    );
};

export default AutoResizingTextarea;