import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext.js';
import { getAllPostsByUser } from '../../Services/Posts/PostService.js';
import PostItem from './PostItem.jsx';
import MessageBanner from '../Common/MessageBanner.jsx';
import LoadingComponent from '../Common/LoadingComponent.jsx';

import '../../Styles/Components/Posts/PostContainer.css';

const PostContainer = () => {
    const { user, loading: authLoading} = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //const { token } = useAuth();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (user && !authLoading) {
            setLoading(true);
            getAllPostsByUser(user.id, token)
                .then(data => {
                    setPosts(data);
                    console.log(posts);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Failed to fetch posts', error); 
                    setError('Failed to fetch posts');
                    setLoading(false);
                });
        }
    }, [user, authLoading]);
    
    if (authLoading || loading) return <div>Loading...</div>;
    if (error) return <MessageBanner message={error} type="error" />;
 
    return (
        <div className='post-container'>
            <h2 className='post-container-header'>My Posts</h2>
            {posts.map(post => <PostItem key={post.id} post={post} />)}
        </div>
    ); 
}; 

export default PostContainer;

