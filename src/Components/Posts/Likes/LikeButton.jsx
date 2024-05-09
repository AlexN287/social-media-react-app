// LikeButton.jsx

import React from 'react';
import '../../../Styles/Components/Posts/Likes/LikeButton.css';

function LikeButton({ isLiked, onLikesButtonClick , onLikesCountClick, showExplosion, likesCount }) {
    return (
        <div className='like-container'>
            <button onClick={onLikesButtonClick} className={`like-button ${isLiked ? 'liked' : 'unliked'}`}>
                {isLiked ? `❤️ Unlike ` : `🤍 Like `}
            </button>
            <span onClick={onLikesCountClick} className="likes-count">
                {`(${likesCount})`}
            </span>
            {showExplosion && (
                <div className="explosion"></div> // Inline explosion effect
            )}
        </div>

    );
}

export default LikeButton;
