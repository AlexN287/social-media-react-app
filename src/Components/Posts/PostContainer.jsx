import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext.js';
import { getAllPostsByUser } from '../../Services/Posts/PostService.js';
import PostItem from './PostItem.jsx';
import MessageBanner from '../Common/MessageBanner.jsx';
import LoadingComponent from '../Common/LoadingComponent.jsx';
import { getLoggedUser } from '../../Services/User/UserService.js';
import { useLocation } from 'react-router-dom';
import { fetchFriendsPosts } from '../../Services/Posts/PostService.js';

import '../../Styles/Components/Posts/PostContainer.css';

const PostContainer = () => {
    // const { user, loading: authLoading} = useAuth();
    const[user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //const { token } = useAuth();
    const token = localStorage.getItem('token');
    const location = useLocation();

    useEffect(() => {
        const fetchUserAndPosts = async () => {
            setLoading(true);
            try {
                const fetchedUser = await getLoggedUser(token);  // Get the logged user
                setUser(fetchedUser);

                if (location.pathname === '/myprofile') {
                    // Fetch posts for the user's profile
                    const postsData = await getAllPostsByUser(fetchedUser.id, token);
                    setPosts(postsData);
                } else if (location.pathname === '/home') {
                    // Fetch posts for the user's friends
                    const postsData = await fetchFriendsPosts(token);
                    setPosts(postsData);
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to initialize data:', error);
                setError('Failed to initialize data');
                setLoading(false);
            }
        };

        fetchUserAndPosts();
    }, [token, location.pathname]);
    
    //if (authLoading || loading) return <div>Loading...</div>;
    if (error) return <MessageBanner message={error} type="error" />;
 
    return (
        <div className='post-container'>
            <h2 className='post-container-header'>{location.pathname === '/myprofile' ? 'My Posts' : 'Friends’ Posts'}</h2>
            {posts.length > 0 ? (
                posts.map(post => <PostItem key={post.id} post={post} />)
            ) : (
                <p>No posts to display.</p> // Display a message when no posts are available
            )}
        </div>
    );
}; 

export default PostContainer;

