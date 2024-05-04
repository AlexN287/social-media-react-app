import React, { useState, useEffect } from 'react';
import { getLikesCount } from '../../Services/Posts/LikeService';
import { getCommentsCount } from '../../Services/Posts/CommentService';
import '../../Styles/Components/Posts/PostItem.css';
import { addLike } from '../../Services/Posts/LikeService';
import { deleteLike } from '../../Services/Posts/LikeService';
import CommentsModal from './Comments/CommentsModal';
import { fetchPostMedia } from '../../Services/Posts/PostService';
import LoadingComponent from '../Common/LoadingComponent';
import LikeButton from './Likes/LikeButton';

const PostItem = ({ post }) => {
    const { content } = post;
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showExplosion, setShowExplosion] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen(!modalOpen);
    const token = localStorage.getItem('token');
    const [mediaUrl, setMediaUrl] = useState(null);
    const [mediaLoading, setMediaLoading] = useState(false);



    useEffect(() => {
        async function fetchMediaAndCounts() {
            setMediaLoading(true);
            try {
                if (post.content.filePath != null) {
                    const mediaUrl = await fetchPostMedia(post.id, token); // Assuming this method handles cases where there is no media and returns null or an appropriate URL.
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
                setLikesCount(likes);
                setCommentsCount(comments);
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

    return (
        <div className="post-item">
            <p>{content.textContent}</p>
            {mediaLoading ? (
                <LoadingComponent />
            ) : mediaUrl ? (
                <img src={mediaUrl} alt="Post" style={{ maxWidth: '100%' }} />
            ) : null
            }

            <div className='post-buttons-container'>
                <LikeButton
                    isLiked={isLiked}
                    onClick={toggleLike}
                    showExplosion={showExplosion}
                    likesCount = {likesCount}
                />

                <button onClick={toggleModal} className="comment-button" aria-label="View comments">
                    💬 Comments ({commentsCount})
                </button>
            </div>

            <CommentsModal
                isOpen={modalOpen}
                onClose={toggleModal}
                post={post}
                mediaUrl={mediaUrl}
            />
        </div>
    );
};

export default PostItem;
