import React, { useEffect, useState } from 'react';
import { getPostsOrderedByReportCount, deletePost } from '../../Services/Posts/PostService';
import UserProfileImage from '../Common/ProfileImage';
import { formatDateOrTime } from '../../Helper/Util';
import Button from '../Common/Button';

import '../../Styles/Components/ModeratorPage/ReportedPosts.css';

const ReportedPostsComponent = ({reportedPosts, setReportedPosts, onViewReports, onDeletePost }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPosts = async () => {
            // Assuming the token is stored in local storage
            if (token) {
                try {
                    const fetchedPosts = await getPostsOrderedByReportCount(token);
                    setReportedPosts(fetchedPosts);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setError('No token found');
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='reported-posts-container'>
            {reportedPosts.length === 0 ? (
                <div className="no-reported-posts-message">
                    <p>No reported posts available.</p>
                </div>
            ) : (
            <ul>
                <h1>Posts Reported</h1>
                {reportedPosts.map(post => (
                    <li key={post.id} className="post-item">
                        <div className="post-header">
                            <div className="post-user-details">
                                <UserProfileImage userId={post.user.id} token={token} size={'small'} />
                                <strong>{post.user.username}</strong>
                            </div>
                            <div className='post-header-right-side'>
                                <small>{formatDateOrTime(post.createdAt)}</small>
                            </div>
                        </div>
                        <p>{post.content.textContent}</p>
                        {/* {post.content.filePath && (
                            <img src={post.content.filePath} alt="Post" style={{ maxWidth: '100%' }} />
                        )} */}

                        <div className='reports-nr-container'>
                            <p>{'Reports Nr: ' + post.reports.length}</p>
                        </div>

                        <div className='reported-post-buttons'>
                            <Button color={'green'} onClick={() => onViewReports(post)}>See Reports</Button>
                            <Button color={'red'} onClick={() => onDeletePost(post.id)}>Delete Post</Button>
                        </div>
                    </li>
                ))}
            </ul>
            )}
        </div>
    );
};

export default ReportedPostsComponent;
