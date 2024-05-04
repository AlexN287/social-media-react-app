// LikeButton.jsx

import React from 'react';
import '../../../Styles/Components/Posts/Likes/LikeButton.css';

function LikeButton({ isLiked, onClick, showExplosion, likesCount }) {
    return (
        <div className='like-container'>
            <button onClick={onClick} className={`like-button ${isLiked ? 'liked' : 'unliked'}`}>
                {isLiked ? `❤️ Unlike (${likesCount})` : `🤍 Like (${likesCount})`}
            </button>
            {showExplosion && (
                <div className="explosion"></div> // Inline explosion effect
            )}
        </div>

    );
}

export default LikeButton;
