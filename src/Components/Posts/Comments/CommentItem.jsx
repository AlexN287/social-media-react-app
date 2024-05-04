import React from 'react';
import UserProfileImage from '../../Common/ProfileImage'; 
import { formatDateOrTime } from '../../../Helper/Util';

import '../../../Styles/Components/Posts/Comments/CommentItem.css';

const CommentItem = ({ comment, token }) => {
    const { content } = comment;

    return (
        <div className="comment-item">
            <div className="comment-profile">
                <UserProfileImage userId={comment.user.id} token={token} size="small" />
            </div>
            <div className="comment-body">
                <div className="comment-main">
                    <strong>{comment.user.username}</strong>
                    <p>{content.textContent}</p>
                </div>
                <span className="comment-time">{formatDateOrTime(comment.timestamp)}</span>
            </div>
        </div>
    );
};

export default CommentItem;

