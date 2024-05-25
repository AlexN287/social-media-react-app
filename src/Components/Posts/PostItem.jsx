import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLikesCount } from '../../Services/Posts/LikeService';
import { getCommentsCount } from '../../Services/Posts/CommentService';
import '../../Styles/Components/Posts/PostItem.css';
import { addLike } from '../../Services/Posts/LikeService';
import { deleteLike } from '../../Services/Posts/LikeService';
import CommentsModal from './Comments/CommentsModal';
import { fetchPostMedia } from '../../Services/Posts/PostService';
import LoadingComponent from '../Common/LoadingComponent';
import LikeButton from './Likes/LikeButton';
import LikesModal from './Likes/LikesModal';
import { checkUserLikedPost } from '../../Services/Posts/LikeService';
import UserProfileImage from '../Common/ProfileImage';
import { formatDateOrTime } from '../../Helper/Util';
import OptionsButton from '../Common/OptionButton';
import Button from '../Common/Button';
import { deletePost } from '../../Services/Posts/PostService';
import { updatePostContent } from '../../Services/Posts/PostService';
import EditPostModal from './EditPostModal';
import { reportPost } from '../../Services/Report/ReportService';
import { getLoggedUser } from '../../Services/User/UserService';
import ReportPostModal from './ReportPostModal';


const PostItem = ({ post, onDelete, onUpdate }) => {
    const { content, user, createdAt } = post;
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showExplosion, setShowExplosion] = useState(false);
    const token = localStorage.getItem('token');
    const [mediaUrl, setMediaUrl] = useState(null);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const location = useLocation();

    const toggleCommentsModal = () => setShowCommentsModal(!showCommentsModal);
    const toggleEditPostModal = () => setShowEditPostModal(!showEditPostModal);
    const toggleReportModal = () => setShowReportModal(!showReportModal);

    const openLikesModal = () => {
        setShowLikesModal(true);
    };

    const closeLikesModal = () => {
        setShowLikesModal(false);
    };

    useEffect(() => {
        async function fetchMediaAndCounts() {
            setMediaLoading(true);
            try {
                if (post.content.filePath != null) {
                    //const mediaUrl = await fetchPostMedia(post.id, token); // Assuming this method handles cases where there is no media and returns null or an appropriate URL.
                    setMediaUrl(mediaUrl);
                    console.log(mediaUrl);
                }
            } catch (error) {
                console.error('Error fetching media:', error);
                setMediaUrl(null);
            } finally {
                setMediaLoading(false);
            }

            try {
                const likes = await getLikesCount(post.id, token);
                const comments = await getCommentsCount(post.id, token);
                const isLikedByUser = await checkUserLikedPost(post.id, token);
                setLikesCount(likes);
                setCommentsCount(comments);
                setIsLiked(isLikedByUser);
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        }
        fetchMediaAndCounts();
    }, [post.id, token]);

    const toggleLike = async () => {
        if (isLiked) {
            try {
                await deleteLike(post.id, localStorage.getItem('token'));
                setIsLiked(false);
                setLikesCount(likesCount - 1); // Decrement likes count
            } catch (error) {
                console.error('Failed to delete like:', error);
            }
        } else {
            try {
                await addLike(post.id, localStorage.getItem('token'));
                setIsLiked(true);
                setLikesCount(likesCount + 1); // Increment likes count
                triggerExplosion();
            } catch (error) {
                console.error('Failed to add like:', error);
            }
        }
    };

    const triggerExplosion = () => {
        setShowExplosion(true);
        setTimeout(() => setShowExplosion(false), 500); // Duration of the animation
    };

    const handleDeletePost = async () => {
        try {
            await deletePost(post.id, token);  // Assuming deletePost is an API call function
            // Optionally, trigger a UI update or redirect
            onDelete(post.id);
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('Failed to delete the post.');
        }
    };

    const handleReportPost = async (reason) => {
        try {
            const loggedUser = await getLoggedUser(token);
            await reportPost(post.id, reason, loggedUser, token);
        } catch (error) {
            console.error('Failed to report post:', error);
        }
    };

    return (
        <div className="post-item">

            <div className="post-header">
                <div className="post-user-details">
                    <UserProfileImage userId={user.id} token={token} size={'small'} />
                    <strong>{user.username}</strong>
                </div>

                <div className='post-header-right-side'>
                    <small>{formatDateOrTime(createdAt)}</small>
                    {location.pathname === '/myprofile' && (
                    <OptionsButton>
                        <button onClick={toggleEditPostModal}>Edit Post</button>
                        <button onClick={handleDeletePost}>Delete Post</button>
                    </OptionsButton>
                )}

                </div>

            </div>

            <p>{content.textContent}</p>
            {mediaUrl ? (
                <img src={mediaUrl} alt="Post" style={{ maxWidth: '100%' }} />
            ) : null
            }



            <div className='post-buttons-container'>
                <LikeButton
                    isLiked={isLiked}
                    onLikesButtonClick={toggleLike}
                    onLikesCountClick={openLikesModal}
                    showExplosion={showExplosion}
                    likesCount={likesCount}
                />

                <button onClick={toggleCommentsModal} className="comment-button" aria-label="View comments">
                    💬 Comments ({commentsCount})
                </button>

                <button onClick={toggleReportModal} className="report-button" aria-label="Report post">
                    🚩 Report
                </button>
            </div>

            <CommentsModal
                isOpen={showCommentsModal}
                onClose={toggleCommentsModal}
                post={post}
                mediaUrl={mediaUrl}
            />
            <LikesModal
                isOpen={showLikesModal}
                onClose={closeLikesModal}
                postId={post.id} // Assuming postId is available
            />

            <EditPostModal
                isOpen={showEditPostModal}
                onClose={toggleEditPostModal}
                post={post}
                onUpdate={onUpdate}
                mediaUrl={mediaUrl}
            />

            <ReportPostModal 
                isOpen={showReportModal}
                onClose={toggleReportModal}
                onSubmit={handleReportPost} // Pass the handleReportPost function to the modal
            />
        </div>
    );
};

export default PostItem;
